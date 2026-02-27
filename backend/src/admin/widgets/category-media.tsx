import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProductCategory } from "@medusajs/framework/types"
import {
  Container,
  Heading,
  Text,
  Button,
  IconButton,
  toast,
  clx,
  Prompt,
  Badge,
} from "@medusajs/ui"
import { PhotoSolid, Trash, Star } from "@medusajs/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { sdk } from "../lib/sdk"
import { useRef, useState, useCallback } from "react"

type CategoryImage = {
  id: string
  url: string
  type: "thumbnail" | "image"
  name?: string | null
  mime_type?: string | null
  size?: number | null
  rank?: number
  file_id?: string | null
  created_at?: string
  updated_at?: string
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

const QUERY_KEY_PREFIX = "category-media"

const CategoryMediaWidget = ({
  data: category,
}: DetailWidgetProps<AdminProductCategory>) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CategoryImage | null>(null)

  // Fetch images from custom module via API
  const { data: imagesData, isLoading } = useQuery<{ images: CategoryImage[] }>({
    queryFn: () =>
      sdk.client.fetch(`/admin/category-media/${category.id}`, {
        method: "GET",
      }),
    queryKey: [[QUERY_KEY_PREFIX, category.id]],
  })

  const images = imagesData?.images || []
  const thumbnail = images.find((img) => img.type === "thumbnail")
  const gallery = images.filter((img) => img.type === "image")
  const allImages = thumbnail ? [thumbnail, ...gallery] : gallery

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [[QUERY_KEY_PREFIX, category.id]],
    })
  }

  // Upload and create image
  const uploadImageMutation = useMutation({
    mutationFn: async ({
      file,
      type,
    }: {
      file: File
      type: "thumbnail" | "image"
    }) => {
      const { files } = await sdk.admin.upload.create({ files: [file] })
      if (!files?.[0]?.url) throw new Error("Upload failed")

      const body = {
        url: files[0].url,
        type,
        name: file.name,
        mime_type: file.type,
        size: file.size,
        file_id: files[0].id,
        rank: type === "thumbnail" ? 0 : allImages.length,
      }

      return sdk.client.fetch(`/admin/category-media/${category.id}`, {
        method: "POST",
        body,
      })
    },
    onSuccess: () => invalidate(),
  })

  // Delete image
  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) =>
      sdk.client.fetch(
        `/admin/category-media/${category.id}/${imageId}`,
        { method: "DELETE" }
      ),
    onSuccess: () => invalidate(),
  })

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files
      if (!fileList || fileList.length === 0) return

      for (const file of Array.from(fileList)) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast.error(t("categoryMedia.title"), {
            description: t("categoryMedia.toast.invalidType"),
          })
          continue
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(t("categoryMedia.title"), {
            description: t("categoryMedia.toast.fileTooLarge"),
          })
          continue
        }

        setIsUploading(true)
        try {
          const type = !thumbnail ? "thumbnail" : "image"
          await uploadImageMutation.mutateAsync({ file, type })
          toast.success(t("categoryMedia.title"), {
            description: t("categoryMedia.toast.uploaded"),
          })
        } catch {
          toast.error(t("categoryMedia.title"), {
            description: t("categoryMedia.toast.uploadError"),
          })
        } finally {
          setIsUploading(false)
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [thumbnail, uploadImageMutation, t]
  )

  const handleRemove = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteImageMutation.mutateAsync(deleteTarget.id)
      toast.success(t("categoryMedia.title"), {
        description: t("categoryMedia.toast.removed"),
      })
    } catch {
      toast.error(t("categoryMedia.title"), {
        description: t("categoryMedia.toast.removeError"),
      })
    } finally {
      setDeleteTarget(null)
    }
  }, [deleteTarget, deleteImageMutation, t])

  const handleSetThumbnail = useCallback(
    async (image: CategoryImage) => {
      try {
        // Delete old thumbnail if exists
        if (thumbnail) {
          await deleteImageMutation.mutateAsync(thumbnail.id)
        }
        // Delete the current image
        await deleteImageMutation.mutateAsync(image.id)

        // Recreate as thumbnail
        const body = {
          url: image.url,
          type: "thumbnail" as const,
          name: image.name,
          mime_type: image.mime_type,
          size: image.size,
          file_id: image.file_id,
          rank: 0,
        }

        await sdk.client.fetch(`/admin/category-media/${category.id}`, {
          method: "POST",
          body,
        })

        // Recreate old thumbnail as regular image if it existed
        if (thumbnail) {
          const thumbBody = {
            url: thumbnail.url,
            type: "image" as const,
            name: thumbnail.name,
            mime_type: thumbnail.mime_type,
            size: thumbnail.size,
            file_id: thumbnail.file_id,
            rank: allImages.length,
          }
          await sdk.client.fetch(`/admin/category-media/${category.id}`, {
            method: "POST",
            body: thumbBody,
          })
        }

        invalidate()
        toast.success(t("categoryMedia.title"), {
          description: t("categoryMedia.toast.thumbnailSet"),
        })
      } catch {
        toast.error(t("categoryMedia.title"), {
          description: t("categoryMedia.toast.uploadError"),
        })
      }
    },
    [thumbnail, allImages, category.id, deleteImageMutation, t]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0 && fileInputRef.current) {
        fileInputRef.current.files = droppedFiles
        fileInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        )
      }
    },
    []
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-2">
            <Heading level="h2">{t("categoryMedia.title")}</Heading>
            {allImages.length > 0 && (
              <Badge size="2xsmall" color="grey">
                {allImages.length}
              </Badge>
            )}
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {t("categoryMedia.addImage")}
          </Button>
        </div>

        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Text size="small" className="text-ui-fg-subtle">
                {t("categoryMedia.loading")}
              </Text>
            </div>
          ) : allImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {allImages.map((image) => (
                <div key={image.id} className="group relative">
                  <div
                    className={clx(
                      "relative aspect-square w-full overflow-hidden rounded-lg border",
                      image.type === "thumbnail"
                        ? "border-ui-border-interactive ring-2 ring-ui-border-interactive"
                        : "border-ui-border-base"
                    )}
                  >
                    <img
                      src={image.url}
                      alt={image.name || "Category image"}
                      className="h-full w-full object-cover"
                    />
                    {image.type === "thumbnail" && (
                      <div className="absolute left-2 top-2">
                        <Badge size="2xsmall" color="blue">
                          {t("categoryMedia.thumbnail")}
                        </Badge>
                      </div>
                    )}
                    {/* Overlay with actions on hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ui-bg-overlay opacity-0 transition-opacity group-hover:opacity-100">
                      {image.type !== "thumbnail" && (
                        <IconButton
                          variant="transparent"
                          size="small"
                          onClick={() => handleSetThumbnail(image)}
                          className="text-ui-fg-on-color"
                        >
                          <Star />
                        </IconButton>
                      )}
                      <IconButton
                        variant="transparent"
                        size="small"
                        onClick={() => setDeleteTarget(image)}
                        className="text-ui-fg-on-color"
                      >
                        <Trash />
                      </IconButton>
                    </div>
                  </div>
                  {image.name && (
                    <Text
                      size="xsmall"
                      leading="compact"
                      className="mt-1 truncate text-ui-fg-subtle"
                    >
                      {image.name}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={clx(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ui-border-strong p-8",
                "transition-colors hover:border-ui-border-interactive hover:bg-ui-bg-subtle-hover",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ui-bg-component">
                <PhotoSolid className="text-ui-fg-subtle" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Text size="small" weight="plus" leading="compact">
                  {isUploading
                    ? t("categoryMedia.uploading")
                    : t("categoryMedia.uploadArea")}
                </Text>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {t("categoryMedia.uploadHint")}
                </Text>
              </div>
            </div>
          )}

          {/* Drop zone when images already exist */}
          {allImages.length > 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={clx(
                "mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-ui-border-strong p-4",
                "transition-colors hover:border-ui-border-interactive hover:bg-ui-bg-subtle-hover",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              <PhotoSolid className="text-ui-fg-subtle" />
              <Text size="small" className="text-ui-fg-subtle">
                {isUploading
                  ? t("categoryMedia.uploading")
                  : t("categoryMedia.dropMore")}
              </Text>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />
        </div>
      </Container>

      <Prompt
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>{t("categoryMedia.delete.title")}</Prompt.Title>
            <Prompt.Description>
              {t("categoryMedia.delete.description")}
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>{t("categoryMedia.cancel")}</Prompt.Cancel>
            <Prompt.Action onClick={handleRemove}>
              {t("categoryMedia.delete.confirm")}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.after",
})

export default CategoryMediaWidget
