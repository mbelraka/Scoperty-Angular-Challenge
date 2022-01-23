import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MatSharedModule } from 'src/app/shared/mat-shared/mat-shared.module';

const SHARED_MODULES = [
  CommonModule,
  FlexLayoutModule,
  FormsModule,
  MatSharedModule
];

@NgModule({
  imports: SHARED_MODULES,
  exports: SHARED_MODULES
})
export class SharedModule {}
