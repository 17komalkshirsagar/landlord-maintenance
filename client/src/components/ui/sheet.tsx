

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "../../lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content
            ref={ref}
            className={cn(
                "fixed inset-y-0 right-0 z-50 w-80 bg-white p-6 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className
            )}
            {...props}
        />
    </SheetPrimitive.Portal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

export { Sheet, SheetTrigger, SheetClose, SheetContent }
