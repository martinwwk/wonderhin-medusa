import { PencilSquare, ThumbnailBadge, Trash } from "@medusajs/icons"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  Text,
  Tooltip,
  clx,
  usePrompt,
} from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { HttpTypes } from "@medusajs/types"

type ProductMedisaSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductMediaSection = ({ product }: ProductMedisaSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const [selection, setSelection] = useState<Record<string, boolean>>({})

  const media = getMedia(product)

  const handleCheckedChange = (id: string) => {
    setSelection((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev
        return rest
      } else {
        return { ...prev, [id]: true }
      }
    })
  }

  const { mutateAsync } = useUpdateProduct(product.id)

  const handleDelete = async () => {
    const ids = Object.keys(selection)
    const includingThumbnail = ids.some(
      (id) => media.find((m) => m.id === id)?.isThumbnail
    )

    const res = await prompt({
      title: t("general.areYouSure"),
      description: includingThumbnail
        ? t("products.media.deleteWarningWithThumbnail", {
            count: ids.length,
          })
        : t("products.media.deleteWarning", {
            count: ids.length,
          }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    const mediaToKeep = product.images
      .filter((i) => !ids.includes(i.id))
      .map((i) => ({ id: i.id, url: i.url }))

    await mutateAsync(
      {
        images: mediaToKeep,
        thumbnail: includingThumbnail ? "" : undefined,
      },
      {
        onSuccess: () => {
          setSelection({})
        },
      }
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.media.label")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.editImages"),
                  to: "media?view=edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      {media.length > 0 ? (
        <div className="px-6 py-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ui-border-base text-left">
                <th className="pb-3 pr-4 text-sm font-medium text-ui-fg-subtle w-[60px]"></th>
                <th className="pb-3 pr-4 text-sm font-medium text-ui-fg-subtle w-[80px]">
                  {t("products.media.thumbnail")}
                </th>
                <th className="pb-3 pr-4 text-sm font-medium text-ui-fg-subtle">
                  {t("products.media.url")}
                </th>
                <th className="pb-3 pr-4 text-sm font-medium text-ui-fg-subtle">
                  {t("products.media.altText")}
                </th>
                <th className="pb-3 text-sm font-medium text-ui-fg-subtle w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {media.map((i, index) => {
                const isSelected = selection[i.id]
                const imageData = product.images?.find((img) => img.id === i.id)

                return (
                  <tr
                    key={i.id}
                    className={clx(
                      "border-b border-ui-border-base transition-fg hover:bg-ui-bg-subtle",
                      {
                        "bg-ui-bg-highlight": isSelected,
                      }
                    )}
                  >
                    <td className="py-3 pr-4">
                      <Checkbox
                        checked={selection[i.id] || false}
                        onCheckedChange={() => handleCheckedChange(i.id)}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="relative size-12 overflow-hidden rounded-[4px]">
                        {i.isThumbnail && (
                          <div className="absolute left-1 top-1 z-10">
                            <Tooltip content={t("fields.thumbnail")}>
                              <ThumbnailBadge />
                            </Tooltip>
                          </div>
                        )}
                        <Link to={`media`} state={{ curr: index }}>
                          <img
                            src={i.url}
                            alt={imageData?.alt || `${product.title} image`}
                            className="size-full object-cover"
                          />
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Text size="small" className="text-ui-fg-subtle truncate max-w-[300px] block">
                        {i.url}
                      </Text>
                    </td>
                    <td className="py-3 pr-4">
                      <Text size="small" className="text-ui-fg-subtle">
                        {imageData?.alt || "-"}
                      </Text>
                    </td>
                    <td className="py-3">
                      <Tooltip content={t("actions.delete")}>
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => {
                            setSelection({ [i.id]: true })
                            handleDelete()
                          }}
                          disabled={!i.id || i.id === "img_thumbnail"}
                        >
                          <Trash />
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 pb-8 pt-6">
          <div className="flex flex-col items-center">
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="text-ui-fg-subtle"
            >
              {t("products.media.emptyState.header")}
            </Text>
            <Text size="small" className="text-ui-fg-muted">
              {t("products.media.emptyState.description")}
            </Text>
          </div>
          <Button size="small" variant="secondary" asChild>
            <Link to="media?view=edit">
              {t("products.media.emptyState.action")}
            </Link>
          </Button>
        </div>
      )}
      <CommandBar open={!!Object.keys(selection).length}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {t("general.countSelected", {
              count: Object.keys(selection).length,
            })}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            action={handleDelete}
            label={t("actions.delete")}
            shortcut="d"
          />
          {Object.keys(selection).length === 1 && (
            <CommandBar.Command
              action={() => {
                navigate(`images/${Object.keys(selection)[0]}/variants`)
                setSelection({})
              }}
              label={t("products.media.manageImageVariants")}
              shortcut="m"
            />
          )}
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

type Media = {
  id: string
  url: string
  isThumbnail: boolean
}

const getMedia = (product: Product) => {
  const { images = [], thumbnail } = product

  const media: Media[] = images.map((image) => ({
    id: image.id,
    url: image.url,
    isThumbnail: image.url === thumbnail,
  }))

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    media.unshift({
      id: "img_thumbnail",
      url: thumbnail,
      isThumbnail: true,
    })
  }

  return media
}
