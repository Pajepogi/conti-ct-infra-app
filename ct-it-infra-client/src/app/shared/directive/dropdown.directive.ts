import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @HostListener('click') click(){
    // let getArrow = this.el.nativeElement.querySelectorAll('#upArrow');
    // console.log(getArrow)
    // this.renderer.setStyle(this.el.nativeElement, 'border', '3px solid red')
  }

}
