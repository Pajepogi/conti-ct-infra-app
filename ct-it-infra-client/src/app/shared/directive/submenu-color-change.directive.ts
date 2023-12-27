import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSubmenuColorChange]'
})
export class SubmenuColorChangeDirective {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @HostListener('click') click(){
   
    console.log(this.el.nativeElement.innerText)
    this.renderer.addClass(this.el.nativeElement, 'expandeds')
  }


}
