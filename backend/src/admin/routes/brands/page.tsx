import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid, Trash, PencilSquare, EllipsisHorizontal } from "@medusajs/icons"
import { 
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  Button,
  toast,
  Drawer,
  Input,
  Label,
  DropdownMenu,
  IconButton,
  Prompt,
} from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { sdk } from "../../lib/sdk"
import { useMemo, useState } from "react"


type Brand = {
  id: string
  name: string
}
type BrandsResponse = {
  brands: Brand[]
  count: number
  limit: number
  offset: number
}

const columnHelper = createDataTableColumnHelper<Brand>()

const BrandsPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [brandName, setBrandName] = useState("")
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null)

  const limit = 15
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/brands`, {
      query: {
        limit,
        offset,
      },
    }),
    queryKey: [["brands", limit, offset]],
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => 
      sdk.client.fetch(`/admin/brands`, {
        method: "POST",
        body: { name },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["brands"]] })
      toast.success(t("brands.title"), {
        description: t("brands.toast.created"),
      })
      handleCloseDrawer()
    },
    onError: () => {
      toast.error(t("brands.title"), {
        description: t("brands.toast.createError"),
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      sdk.client.fetch(`/admin/brands/${id}`, {
        method: "POST",
        body: { name },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["brands"]] })
      toast.success(t("brands.title"), {
        description: t("brands.toast.updated"),
      })
      handleCloseDrawer()
    },
    onError: () => {
      toast.error(t("brands.title"), {
        description: t("brands.toast.updateError"),
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      sdk.client.fetch(`/admin/brands/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["brands"]] })
      toast.success(t("brands.title"), {
        description: t("brands.toast.deleted"),
      })
    },
    onError: () => {
      toast.error(t("brands.title"), {
        description: t("brands.toast.deleteError"),
      })
    },
  })

  const handleOpenDrawer = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand)
      setBrandName(brand.name)
    } else {
      setEditingBrand(null)
      setBrandName("")
    }
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingBrand(null)
    setBrandName("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName.trim()) {
      toast.error(t("brands.title"), {
        description: t("brands.toast.nameRequired"),
      })
      return
    }

    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, name: brandName })
    } else {
      createMutation.mutate(brandName)
    }
  }

  const handleDelete = (brand: Brand) => {
    setDeletingBrand(brand)
  }

  const confirmDelete = () => {
    if (deletingBrand) {
      deleteMutation.mutate(deletingBrand.id)
      setDeletingBrand(null)
    }
  }

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: t("brands.name"),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton variant="transparent">
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => handleOpenDrawer(row.original)}
              >
                <PencilSquare className="mr-2" />
                {t("brands.menu.edit")}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onClick={() => handleDelete(row.original)}
              >
                <Trash className="mr-2" />
                {t("brands.menu.delete")}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      ),
    }),
  ], [t])

  const table = useDataTable({
    columns,
    data: data?.brands || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <>
      <Container className="divide-y p-0">
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <Heading>{t("brands.title")}</Heading>
            <Button onClick={() => handleOpenDrawer()} variant="secondary" size="small">
              {t("brands.create")}
            </Button>
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </Container>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              {editingBrand ? t("brands.edit") : t("brands.createTitle")}
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t("brands.name")}</Label>
                <Input
                  id="name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder={t("brands.namePlaceholder")}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseDrawer}
                >
                  {t("brands.cancel")}
                </Button>
                <Button
                  type="submit"
                  isLoading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingBrand ? t("brands.update") : t("brands.create")}
                </Button>
              </div>
            </form>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>

      <Prompt open={!!deletingBrand} onOpenChange={(open) => !open && setDeletingBrand(null)}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>{t("brands.delete.title")}</Prompt.Title>
            <Prompt.Description>
              {t("brands.delete.description", { name: deletingBrand?.name })}
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>{t("brands.cancel")}</Prompt.Cancel>
            <Prompt.Action onClick={confirmDelete}>
              {t("brands.menu.delete")}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
})

export default BrandsPage