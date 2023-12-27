import { Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appSelectOptionChange]'
})

export class SelectOptionChangeDirective {

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }


    @HostListener('click') onClick() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'borderRadius', '25px 25px 0 0')
    }

    @HostListener('change') onChange() {
        setTimeout(() => {
            this.renderer.setStyle(this.elementRef.nativeElement, 'borderRadius', '25px')
            this.renderer.setStyle(this.elementRef.nativeElement, 'border', '1px solid #ced4da')
        }, 500)
    }

    @HostListener('blur') onBlur() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'borderRadius', '25px')
    }

}