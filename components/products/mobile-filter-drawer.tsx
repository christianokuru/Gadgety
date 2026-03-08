'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ProductFilters as FiltersComponent } from './product-filters'
import type { ProductFilters } from '@/types'

interface MobileFilterDrawerProps {
  currentFilters: ProductFilters
}

export function MobileFilterDrawer({ currentFilters }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="lg:hidden">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FiltersComponent currentFilters={currentFilters} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
