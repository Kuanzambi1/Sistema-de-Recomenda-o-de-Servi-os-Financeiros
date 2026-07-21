"use client"

import type { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react"

export interface AdminColumn<T> {
  key: string
  header: string
  render: (item: T, index: number) => ReactNode
  className?: string
  headerClassName?: string
}

interface AdminTableProps<T> {
  columns: AdminColumn<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  total?: number
  page?: number
  perPage?: number
  loading?: boolean
  emptyMessage?: string
  onPageChange?: (page: number) => void
  renderCard?: (item: T, index: number) => ReactNode
}

export default function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  total = 0,
  page = 1,
  perPage = 10,
  loading = false,
  emptyMessage = "Nenhum registo encontrado.",
  onPageChange,
  renderCard,
}: AdminTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm overflow-hidden">
      {renderCard ? (
        <div className="block lg:hidden divide-y divide-[#c4c6d04d]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="p-4 flex flex-col gap-3">
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="h-4 rounded bg-[#c4c6d02b] animate-pulse" />
                ))}
              </div>
            ))
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#44474f] gap-3">
              <Inbox className="w-10 h-10" />
              <p className="text-base">{emptyMessage}</p>
            </div>
          ) : (
            data.map((item, index) => (
              <div key={keyExtractor(item)}>
                {renderCard(item, index)}
              </div>
            ))
          )}
          {total > perPage && onPageChange && (
            <MobilePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
          )}
        </div>
      ) : null}

      <div className={renderCard ? "hidden lg:block" : ""}>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f3ff80]">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-[#44474f] text-xs font-bold tracking-[0.6px] py-5 px-6 ${col.headerClassName || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-6 py-4">
                      <div className="h-5 rounded bg-[#c4c6d02b] animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-[#44474f]">
                    <Inbox className="w-10 h-10" />
                    <p className="text-base">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={keyExtractor(item)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={`px-6 py-4 ${col.className || ""}`}>
                      {col.render(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {total > perPage && onPageChange && (
          <DesktopPagination page={page} totalPages={totalPages} perPage={perPage} total={total} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  )
}

function DesktopPagination({ page, totalPages, perPage, total, onPageChange }: {
  page: number; totalPages: number; perPage: number; total: number; onPageChange: (p: number) => void
}) {
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  return (
    <div className="hidden lg:flex items-center justify-between px-6 py-4 border-t border-[#c4c6d04d] bg-[#f0f3ff]">
      <p className="text-[#44474f] text-sm">Mostrando {from} a {to} de {total}</p>
      <PageButtons page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}

function MobilePagination({ page, totalPages, onPageChange }: {
  page: number; totalPages: number; onPageChange: (p: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#c4c6d04d] bg-[#f0f3ff] lg:hidden">
      <PageButtons page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}

function PageButtons({ page, totalPages, onPageChange }: {
  page: number; totalPages: number; onPageChange: (p: number) => void
}) {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => start + i).filter((p) => p <= totalPages)

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#c4c6d0] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-3 h-3 text-[#44474f]" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded flex items-center justify-center text-sm border transition-colors cursor-pointer ${
            p === page
              ? "bg-[#00163c] text-white border-[#00163c]"
              : "bg-white text-[#44474f] border-[#c4c6d0] hover:bg-[#f0f3ff]"
          }`}
          aria-label={`Página ${p}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#c4c6d0] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label="Próxima página"
      >
        <ChevronRight className="w-3 h-3 text-[#44474f]" />
      </button>
    </div>
  )
}
