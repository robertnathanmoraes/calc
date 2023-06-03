import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyMask]'
})
export class CurrencyMaskDirective {

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Remove tudo exceto os dígitos numéricos
    const digitsValue = value.replace(/[^0-9]/g, '');
    // Converte para o valor em centavos
    const centsValue = parseInt(digitsValue) / 100;
    // Formata o valor em moeda com R$ e duas casas decimais
    const formattedValue = `R$ ${centsValue.toFixed(2)}`;
    // Atualiza o valor no campo de entrada
    this.el.value = formattedValue;
  }

}
