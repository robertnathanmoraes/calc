import {Component} from '@angular/core';
// @ts-ignore
import faixasEtariasJSON from '../assets/formula.json';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
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
      nome: 'Enteado(a)',
      value: 'Enteado(a)',
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
      nome: 'Menor sob guarda',
      value: 'Menor sob guarda',
    },
    {
      nome: 'Tutelado(a)',
      value: 'Tutelado(a)'
    },
  ]
  calculoSalario: string = '';
  idade: string = '';
  resultado: string = '';
  submitForm: any;

  constructor(private formBuilder: FormBuilder) {
    this.submitForm = this.formBuilder.group({
      salarioContribuicao: [''],
      idade: [''],
      grauDependencia: [''],
      dependenteIdade: ['']
    });
  }

  loadFaixasEtarias() {
    const faixasEtarias: FaixaEtaria[] = faixasEtariasJSON.faixas;
    this.resultado = this.calcularTetoPorcentagem(faixasEtarias).toFixed(2);
  }

  calcularTetoPorcentagem(faixasEtarias: FaixaEtaria[]): number {
    const calculoSalario = parseFloat(this.submitForm.value.salarioContribuicao);
    const idade = parseFloat(this.submitForm.value.idade);

    console.log('Idade:', idade);
    console.log('Faixas:', faixasEtarias);

    for (let i = 0; i < faixasEtarias.length; i++) {
      const faixa = faixasEtarias[i];
      console.log('Verificando faixa:', faixa);

      if (idade >= faixa.idadeMin && idade <= faixa.idadeMax) {
        const valorCalculo = (calculoSalario * faixa.porcentagem) / 100;
        console.log('Valor cálculo:', valorCalculo);

        return Math.min(valorCalculo, faixa.teto);
      }
    }

    return 0; // Faixa etária não encontrada
  }
}
interface FaixaEtaria {
  idadeMin: number;
  idadeMax: number;
  teto: number;
  porcentagem: number;
}
