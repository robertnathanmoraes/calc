import {Component} from '@angular/core';
// @ts-ignore
import faixasEtariasJSON from '../assets/formula.json';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {map, Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  faixasEtarias: FaixaEtaria[];
  resultados: { faixaIdade: any; valorCalculo: any }[] = [];
  salario: string = '';
  idade: any = '';
  resultado: string = '';
  submitForm: any;
  faixaIdade: string | undefined
  calcular1: number = 0;
  calcular2: number = 0;
  calcular3: number = 0;
  calcular4: number = 0;
  totalDependente: string | undefined;
  grauDependencia = [
    {
      nome: 'Cônjuge e companheiro(a)',
      value: 'Cônjuge e companheiro(a)'
    },
    {
      nome: 'Dependente sob condição de invalidez',
      value: 'Dependente sob condição de invalidez',
    },
    {
      nome: 'Filho(a)',
      value: 'Filho(a)',
    },
    {
      nome: 'Ex-cônjuge ou Ex-convivente com pensão alimenticia',
      value: 'Ex-cônjuge ou Ex-convivente com pensão alimenticia',
    },
    {
      nome: 'Tutelado(a)',
      value: 'Tutelado(a)'
    },
  ]
  valorTitular: string | undefined;
  disableCalcular: boolean | any = true;
  errorEnable: boolean | any = false;
  adicionarDependentesbt: boolean = true;

  isLandscape$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.TabletLandscape, Breakpoints.WebLandscape])
      .pipe(
          map(result => result.matches)
      );
  // @ts-ignore
  calculoIpe: string;
  // @ts-ignore
  resultadoPatronal: string;
    // @ts-ignore
  resultadoReposInflacao: string;

  constructor(private formBuilder: FormBuilder,
              private breakpointObserver: BreakpointObserver,
              ) {

    // Carregar faixas etárias do JSON
    this.faixasEtarias = faixasEtariasJSON.faixas;
    this.submitForm = this.formBuilder.group({
      salarioContribuicao: [null, Validators.required],
      idade: ['', Validators.required],
      grauDependencia: [''],
      dependenteIdade: [''],
      numeroDependentes: [''],
      dependentes: this.formBuilder.array([])
    });
  }

  validateInputIdade(event: any) {
    const inputValue = event.target.value;
    if (inputValue && !/^(0|[1-9][0-9]?|1[01][0-9]|120)$/.test(inputValue)) {
      event.target.value = inputValue.slice(0, -1); // Remove o último caractere inválido
    }
  }
  validateInputDependentes(event: any) {
    const inputValue = event.target.value;
    if (inputValue && !/^([0-9]|1[0-9]|20)$/.test(inputValue)) {
      event.target.value = inputValue.slice(0, -1); // Remove o último caractere inválido


    }
    this.submitForm.value.numeroDependentes = event.target.value

  }

  transform(value: string): string {
    const primeiroEspaco = value.indexOf(' ');
    if (primeiroEspaco !== -1) {
      return value.substring(0, primeiroEspaco);
    }

    return value;
  }

  public validateInputValue(event: KeyboardEvent): boolean {
    const inputChar = event.key;

    // Verifica se o caractere digitado é um caracter especial
    if (this.isSpecialCharacter(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  private isSpecialCharacter(char: string): boolean {
    const regex = /[^0-9\b]/g;
    // @ts-ignore
    if (event.key === 'Backspace') {
      return false; // Permite que a tecla "Backspace" seja usada para apagar
    } else {
      return regex.test(char);
    }

  }

  disableBtCalcular() {
    this.errorEnable = false;
    this.disableCalcular = false;

    const dependentes = this.submitForm.get('dependentes') as FormArray; // pega todos dependentes
    let temValorMenor = false;

    if (this.submitForm.value.idade >= 121 || this.submitForm.value.salarioContribuicao >= 1000000) {
      this.disableCalcular = true;
      return; // Retorna imediatamente, já que a idade é inválida
    }

    dependentes.controls.forEach((dependenteGroup: any) => { // passa por cada dependente
      const grauDependencia = dependenteGroup.value.grauDependencia; // nome do tipo de dependente
      const dependenteIdade = parseFloat(dependenteGroup.value.dependenteIdade); // idade do dependente

      if (dependenteIdade >= 121){
        this.disableCalcular = true
      }

      if (grauDependencia == 'Filho(a)' && dependenteIdade > this.submitForm.value.idade) {
        temValorMenor = true;
        this.disableCalcular = this.submitForm.invalid || temValorMenor;
        this.errorEnable = true;
        return; // Retorna imediatamente, já que um valor menor foi encontrado
      }
    });

    // Verifica se o formulário é inválido ou se temValorMenor é true

    // descer ate a tabela quando clicar em calcular
    setTimeout(scroll => {
      window.location.href = '#tabela';
    }, 1000)

    setTimeout(scroll => {
      window.location.href = '#tabelaMobile';
    }, 1000)
  }

  formatCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formatter.format(value);
  }

  adicionarDependentes() {
    const numeroDependentes = this.submitForm.value.numeroDependentes;

    // Limpar dependentes existentes
    this.limparDependentes();

    // Adicionar novos dependentes com base no número digitado
    for (let i = 0; i < numeroDependentes; i++) {
      this.adicionarDependente();
    }
    const dependenteFormControl = this.submitForm.get('dependentes').controls.get('dependenteIdade') as FormControl;

    dependenteFormControl.reset()
  }

  adicionarDependente() {
    const dependentes = this.submitForm.get('dependentes') as FormArray;

    const dependenteGroup = this.formBuilder.group({
      grauDependencia: ['Cônjuge e companheiro(a)', Validators.required],
      dependenteIdade: [null, Validators.required]
    });

    dependentes.push(dependenteGroup);
  }

  limparDependentes() {
    const dependentes = this.submitForm.get('dependentes') as FormArray;
    dependentes.clear();
  }

  loadFaixasEtarias() {
    if (!faixasEtariasJSON || !faixasEtariasJSON.valores) {
      console.log('Faixas etárias não carregadas corretamente');
      return;
    }

    this.faixasEtarias = faixasEtariasJSON.valores;
    const salario = parseFloat(this.submitForm.value.salarioContribuicao);
    const idade = parseFloat(this.submitForm.value.idade);

    // @ts-ignore
    this.calcular1 = this.calcularCenario1(salario);
    // @ts-ignore
    this.calcular2 = this.calcularCenario2(salario, idade);
    // @ts-ignore
    this.calcular3 = this.calcularCenario3(salario);
    // @ts-ignore
    this.calcular4 = this.calcularCenario4(salario);
  }

  calcularCenario1(salario: number, idade: number) {
    // Cálculo 1: 3.10% sobre o salário
    const valor = (salario * 3.1) / 100;
    const faixaIdade = this.obterFaixaIdade(idade);
    // @ts-ignore
    this.resultados.push({salario, idade, faixaIdade, valor});
    console.log('calci')
    this.calculoIpe = this.formatCurrency((valor + valor))
    return this.formatCurrency(valor)
  }

  calcularCenario2(salario: any, idade: number) {
    // Cálculo 2: 3.60% sobre o salário, adicionando o valor sobre cada dependente conforme tabela de valores por idade.,
    // podendo atingir o valor máximo de 12% do salário do funcionário
    this.valorTitular = this.formatCurrency((salario * 3.6) / 100);
    const valorTitular = (salario * 3.6) / 100
    const valorDependentes = this.calcularValorDependentes(idade);
    const valor = Math.min(Number((valorTitular + valorDependentes)), (salario * 12) / 100);
    this.resultadoPatronal = this.formatCurrency((valor + valorTitular))
    // @ts-ignore
    return this.formatCurrency(valor)

  }

  calcularCenario3(salario: number) {
    // Cálculo 3: 60% do salário + salário
    const valor = (salario * 60) / 100 + salario;
    // @ts-ignore
    this.resultados.push({salario, idade: null, faixaIdade: null, valor});
    return this.formatCurrency(valor)

  }

  calcularCenario4(salario: number) {
    // Cálculo 4: 3.10% do salário do cálculo 3
    const valorCenario3 = (salario * 60) / 100 + salario;
    const valor = (valorCenario3 * 3.1) / 100;
    // @ts-ignore
    this.resultados.push({salario, idade: null, faixaIdade: null, valor});

    this.resultadoReposInflacao = this.formatCurrency((valor + valor))
    return this.formatCurrency(valor)

  }

  // Outros métodos de cálculo...

  obterFaixaIdade(idade: number): string {
    for (const faixa of this.faixasEtarias) {


      if (idade >= 60) {
        return 'Acima de 59'
      }
      if (idade >= faixa.idadeMin && idade <= faixa.idadeMax) {
        return faixa.idadeMin + ' - ' + faixa.idadeMax;
      }
    }
    return 'Faixa etária não encontrada';
  }

  obterValorDaFaixaDeIdade(idade: number): any {
    for (const faixa of this.faixasEtarias) {
      if (idade >= faixa.idadeMin && idade <= faixa.idadeMax) {
        return this.formatCurrency(faixa.valor)
      }
    }

    return null;
  }

  calcularValorDependentes(idade: number): number {
    const dependentes = this.submitForm.get('dependentes') as FormArray; //pega todos depententes
    let valorTotalDependentes = 0;

    dependentes.controls.forEach((dependenteGroup: any) => { //passa por cada dependente
      const grauDependencia = dependenteGroup.value.grauDependencia; //nome do tipo de dependente
      const dependenteIdade = parseFloat(dependenteGroup.value.dependenteIdade); //idade do dependente

      let dependenteValor = 0;

      // Procurar o valor correspondente no JSON
      const valorDependente = faixasEtariasJSON.valores.find((valor: any) => { //pega valores

        // se idade do dependente for maior ou igaul ao valor minimo que esta no laço e valor idade for nula ou menor que a idade maxima da vez
        //retorna true e pega o item.
        return dependenteIdade >= valor.idadeMin && (valor.idadeMax === null || dependenteIdade <= valor.idadeMax);
      });

      if (valorDependente) {
        dependenteValor = valorDependente.valor;
      }

      // Adicionar o valor do dependente ao total
      valorTotalDependentes += dependenteValor;

    });

    // Somar o valor dos dependentes ao valor base (3.60% do salário)
    this.totalDependente = this.formatCurrency(valorTotalDependentes)

    // Verificar se o valor total ultrapassa o teto de 12% do salário
    return valorTotalDependentes;
  }

  clearTable() {
    this.valorTitular = ''
  }

  disableBtAddDependentes() {
    if(this.submitForm.value.numeroDependentes >= 21){
      this.adicionarDependentesbt = true
    } else {
      this.adicionarDependentesbt = false
    }
  }
}

interface FaixaEtaria {
  idadeMin: number;
  idadeMax: number;
  teto: number;
  valor: number;
}

interface ResultadoCalculo {
  salario: number;
  idade: number | null;
  faixaIdade: string | null;
  valor: number;
}
