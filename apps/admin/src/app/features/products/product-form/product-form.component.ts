import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

/**
 * Validador customizado: verifica se URL é válida
 */
function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  try {
    new URL(control.value);
    return null;
  } catch {
    return { invalidUrl: true };
  }
}

/**
 * Validador customizado: ano de fundação válido
 */
function foundedYearValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const year = Number(control.value);
  const currentYear = new Date().getFullYear();

  if (year < 1800 || year > currentYear) {
    return { invalidYear: { min: 1800, max: currentYear } };
  }

  return null;
}

/**
 * Componente de formulário demonstrando:
 * - Reactive Forms completo
 * - FormGroup aninhado (location, companyInfo, pricing)
 * - FormArray para features e tags
 * - Validadores customizados
 * - Feedback visual de erros
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="form-container">
      <header class="page-header">
        <a mat-icon-button routerLink="/products">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1>{{ isEditMode ? 'Editar Produto' : 'Novo Produto' }}</h1>
      </header>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Carregando...</p>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Basic Info -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-icon mat-card-avatar>info</mat-icon>
              <mat-card-title>Informações Básicas</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Nome do Produto</mat-label>
                  <input matInput formControlName="name" />
                  @if (form.get('name')?.hasError('required')) {
                    <mat-error>Nome é obrigatório</mat-error>
                  }
                  @if (form.get('name')?.hasError('minlength')) {
                    <mat-error>Mínimo 3 caracteres</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Website</mat-label>
                  <input matInput formControlName="website" placeholder="https://..." />
                  @if (form.get('website')?.hasError('required')) {
                    <mat-error>Website é obrigatório</mat-error>
                  }
                  @if (form.get('website')?.hasError('invalidUrl')) {
                    <mat-error>URL inválida</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descrição</mat-label>
                <textarea matInput formControlName="description" rows="4"></textarea>
                @if (form.get('description')?.hasError('required')) {
                  <mat-error>Descrição é obrigatória</mat-error>
                }
                @if (form.get('description')?.hasError('minlength')) {
                  <mat-error>Mínimo 20 caracteres</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Logo (URL ou Emoji)</mat-label>
                <input matInput formControlName="logo" placeholder="https://... ou 🚀" />
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <!-- Location - FormGroup aninhado -->
          <mat-card class="form-section" formGroupName="location">
            <mat-card-header>
              <mat-icon mat-card-avatar>location_on</mat-icon>
              <mat-card-title>Localização</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>País</mat-label>
                  <mat-select formControlName="country">
                    <mat-option value="Brasil">🇧🇷 Brasil</mat-option>
                    <mat-option value="Estados Unidos">🇺🇸 Estados Unidos</mat-option>
                    <mat-option value="Alemanha">🇩🇪 Alemanha</mat-option>
                    <mat-option value="Reino Unido">🇬🇧 Reino Unido</mat-option>
                    <mat-option value="França">🇫🇷 França</mat-option>
                    <mat-option value="Japão">🇯🇵 Japão</mat-option>
                    <mat-option value="China">🇨🇳 China</mat-option>
                    <mat-option value="Índia">🇮🇳 Índia</mat-option>
                    <mat-option value="Outro">🌍 Outro</mat-option>
                  </mat-select>
                  @if (form.get('location.country')?.hasError('required')) {
                    <mat-error>País é obrigatório</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Estado (opcional)</mat-label>
                  <input matInput formControlName="state" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Cidade (opcional)</mat-label>
                  <input matInput formControlName="city" />
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Company Info - FormGroup aninhado -->
          <mat-card class="form-section" formGroupName="companyInfo">
            <mat-card-header>
              <mat-icon mat-card-avatar>business</mat-icon>
              <mat-card-title>Informações da Empresa</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Ano de Fundação</mat-label>
                  <input matInput type="number" formControlName="foundedYear" />
                  @if (form.get('companyInfo.foundedYear')?.hasError('invalidYear')) {
                    <mat-error>Ano inválido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Tamanho</mat-label>
                  <mat-select formControlName="size">
                    <mat-option value="startup">Startup</mat-option>
                    <mat-option value="small">Pequena</mat-option>
                    <mat-option value="medium">Média</mat-option>
                    <mat-option value="large">Grande</mat-option>
                    <mat-option value="enterprise">Enterprise</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Pricing - FormGroup aninhado -->
          <mat-card class="form-section" formGroupName="pricing">
            <mat-card-header>
              <mat-icon mat-card-avatar>payments</mat-icon>
              <mat-card-title>Preços</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Tipo de Preço</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="free">Gratuito</mat-option>
                    <mat-option value="freemium">Freemium</mat-option>
                    <mat-option value="paid">Pago</mat-option>
                    <mat-option value="enterprise">Enterprise</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Moeda</mat-label>
                  <mat-select formControlName="currency">
                    <mat-option value="BRL">BRL (Real)</mat-option>
                    <mat-option value="USD">USD (Dólar)</mat-option>
                    <mat-option value="EUR">EUR (Euro)</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descrição dos Preços</mat-label>
                <textarea matInput formControlName="description" rows="3"
                  placeholder="Ex: Plano gratuito com limitações, assinatura mensal a partir de R$ 50"></textarea>
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <!-- Features - FormArray -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-icon mat-card-avatar>check_circle</mat-icon>
              <mat-card-title>Features</mat-card-title>
              <button mat-icon-button type="button" (click)="addFeature()" class="add-btn">
                <mat-icon>add</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div formArrayName="features" class="array-container">
                @for (feature of features.controls; track $index) {
                  <div class="array-item">
                    <mat-form-field appearance="outline" class="flex-grow">
                      <input matInput [formControlName]="$index" placeholder="Ex: Integração com APIs" />
                    </mat-form-field>
                    <button mat-icon-button type="button" color="warn" (click)="removeFeature($index)">
                      <mat-icon>remove_circle</mat-icon>
                    </button>
                  </div>
                }
                @if (features.length === 0) {
                  <p class="empty-message">Nenhuma feature adicionada</p>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Tags - FormArray -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-icon mat-card-avatar>label</mat-icon>
              <mat-card-title>Tags</mat-card-title>
              <button mat-icon-button type="button" (click)="addTag()" class="add-btn">
                <mat-icon>add</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div formArrayName="tags" class="array-container">
                @for (tag of tags.controls; track $index) {
                  <div class="array-item">
                    <mat-form-field appearance="outline" class="flex-grow">
                      <input matInput [formControlName]="$index" placeholder="Ex: SaaS, CRM, Marketing" />
                    </mat-form-field>
                    <button mat-icon-button type="button" color="warn" (click)="removeTag($index)">
                      <mat-icon>remove_circle</mat-icon>
                    </button>
                  </div>
                }
                @if (tags.length === 0) {
                  <p class="empty-message">Nenhuma tag adicionada</p>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Status -->
          <mat-card class="form-section">
            <mat-card-header>
              <mat-icon mat-card-avatar>toggle_on</mat-icon>
              <mat-card-title>Status</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-checkbox formControlName="isFeatured">
                Produto em Destaque
              </mat-checkbox>
            </mat-card-content>
          </mat-card>

          <!-- Actions -->
          <div class="form-actions">
            <button mat-button type="button" routerLink="/products">
              Cancelar
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="form.invalid || saving"
            >
              @if (saving) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                {{ isEditMode ? 'Salvar Alterações' : 'Criar Produto' }}
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .form-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        font-size: 1.75rem;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;

      p {
        margin-top: 16px;
        color: #666;
      }
    }

    .form-section {
      margin-bottom: 24px;

      mat-card-header {
        margin-bottom: 16px;

        mat-icon[mat-card-avatar] {
          background: #e8f5ef;
          color: #107047;
          padding: 8px;
          border-radius: 50%;
        }
      }

      .add-btn {
        margin-left: auto;
      }
    }

    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }
    }

    .full-width {
      width: 100%;
    }

    .array-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .array-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .flex-grow {
        flex: 1;
      }
    }

    .empty-message {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding: 24px 0;

      button {
        min-width: 150px;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private productService = inject(ProductService);

  form!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  saving = false;

  // Getters para FormArrays
  get features(): FormArray {
    return this.form.get('features') as FormArray;
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.initForm();

    // Verifica se é modo de edição
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      website: ['', [Validators.required, urlValidator]],
      logo: [''],

      // FormGroup aninhado: location
      location: this.fb.group({
        country: ['', Validators.required],
        state: [''],
        city: [''],
        flag: ['']
      }),

      // FormGroup aninhado: companyInfo
      companyInfo: this.fb.group({
        foundedYear: [null, foundedYearValidator],
        size: ['startup']
      }),

      // FormGroup aninhado: pricing
      pricing: this.fb.group({
        type: ['freemium'],
        currency: ['BRL'],
        description: ['']
      }),

      // FormArrays
      features: this.fb.array([]),
      tags: this.fb.array([]),

      isFeatured: [false]
    });
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.productService.getById(id).subscribe(product => {
      if (product) {
        this.patchForm(product);
      }
      this.loading = false;
    });
  }

  private patchForm(product: Product): void {
    // Patch valores básicos
    this.form.patchValue({
      name: product.name,
      description: product.description,
      website: product.website,
      logo: product.logo,
      location: product.location,
      companyInfo: product.companyInfo,
      pricing: product.pricing,
      isFeatured: product.isFeatured
    });

    // Popula FormArrays
    product.features?.forEach(f => this.features.push(this.fb.control(f)));
    product.tags?.forEach(t => this.tags.push(this.fb.control(t)));
  }

  addFeature(): void {
    this.features.push(this.fb.control(''));
  }

  removeFeature(index: number): void {
    this.features.removeAt(index);
  }

  addTag(): void {
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.form.value;

    // Filtra arrays vazios
    formValue.features = (formValue.features || []).filter((f: string) => f?.trim());
    formValue.tags = (formValue.tags || []).filter((t: string) => t?.trim());

    // Gera slug do nome
    formValue.slug = formValue.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Remove campos undefined (Firestore não aceita undefined)
    const cleanData = this.removeUndefined(formValue);

    const onSuccess = () => {
      this.snackBar.open(
        this.isEditMode ? 'Produto atualizado!' : 'Produto criado!',
        'OK',
        { duration: 3000 }
      );
      this.router.navigate(['/products']);
    };

    const onError = (err: Error) => {
      this.snackBar.open('Erro ao salvar: ' + err.message, 'OK', { duration: 5000 });
      this.saving = false;
    };

    if (this.isEditMode) {
      this.productService.update(this.productId!, cleanData as Partial<Product>).subscribe({
        next: onSuccess,
        error: onError
      });
    } else {
      this.productService.create(cleanData as Omit<Product, 'id'>).subscribe({
        next: onSuccess,
        error: onError
      });
    }
  }

  /**
   * Remove recursivamente campos undefined do objeto.
   * Firestore não aceita valores undefined.
   */
  private removeUndefined(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue;
      }

      if (value === null) {
        result[key] = null;
      } else if (Array.isArray(value)) {
        result[key] = value.filter(item => item !== undefined);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.removeUndefined(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
