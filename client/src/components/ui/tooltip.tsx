import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

/**
 * Provedor: envolve o app todo para habilitar tooltips
 */
export const TooltipProvider = TooltipPrimitive.Provider

/**
 * Uso básico:
 * <Tooltip>
 *   <TooltipTrigger>Algum botão</TooltipTrigger>
 *   <TooltipContent>Texto do tooltip</TooltipContent>
 * </Tooltip>
 */
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

type ContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  className?: string
}

/**
 * O “balãozinho” em si, estilizado com Tailwind + variáveis do tema (shadcn)
 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  ContentProps
>(({ className = "", sideOffset = 4, ...props }, ref) => {
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md ${className}`}
      {...props}
    />
  )
})
TooltipContent.displayName = "TooltipContent"
