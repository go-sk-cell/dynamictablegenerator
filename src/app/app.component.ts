import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PositiveNumberDirective } from './directives/allow-only-number';
import { OnlyAlphabetsDirective } from './directives/allow-only-alphabet';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    OnlyAlphabetsDirective,
    PositiveNumberDirective],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'dynamictablegenerator';
  newForm: FormGroup;
  totalHours: number = 0;
  workingDays: any;
  subjectPerDay: any;
  totalSubject: any;
  subjectForm!: FormGroup;
  subjectHours: { subjectName: string; hours: number }[] = [];
  timeTableArray: string[][] = [];

  constructor(private fb: FormBuilder) {
    this.newForm = this.fb.group({
      noOfWorkingDays: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(7)]
      ],
      noOfSubjectsPerDay: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(8),]
      ],
      totalSubject: ['', [
        Validators.required,
        Validators.min(1)]
      ],
    })

    this.subjectForm = this.fb.group({
      subject: this.fb.array([]),
    });
  }

  get totalEnteredHours(): number {
    return this.subject.controls.reduce(
      (sum: any, ctrl: any) => sum + +ctrl.value.hours,
      0
    );
  }

  onSubmit() {
    this.newForm.markAllAsTouched();
    if (this.newForm.invalid) { return }
    this.subjectPerDay = this.newForm.value.noOfSubjectsPerDay;
    this.workingDays = this.newForm.value.noOfWorkingDays;
    this.totalSubject = this.newForm.value.totalSubject;
    this.totalHours = this.workingDays * this.subjectPerDay;
    this.newForm.reset();
    this.createDynamicForm();
  }

  get subject(): FormArray {
    return this.subjectForm.get('subject') as FormArray;
  }

  createDynamicForm() {
    const subjectArray = this.subjectForm.get('subject') as FormArray;
    subjectArray.clear();
    for (let i = 0; i < this.totalSubject; i++) {
      subjectArray.push(
        this.fb.group({
          subjectName: ['', Validators.required],
          hours: ['', Validators.required],
        })
      );
    }
  }

  onClear() {
    this.newForm.reset();
    this.timeTableArray = [];
    this.totalHours = 0;
  }

  shuffle(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generateTable() {
    this.subjectHours = this.subjectForm.value.subject;
    let subjectPool: string[] = [];
    this.subjectHours.forEach((subject) => {
      for (let i = 0; i < subject.hours; i++) {
        subjectPool.push(subject.subjectName);
      }
    });

    subjectPool = this.shuffleArray(subjectPool);
    this.timeTableArray = [];
    let index = 0;
    for (let i = 0; i < this.subjectPerDay; i++) {
      const row: string[] = [];
      for (let j = 0; j < this.workingDays; j++) {
        row.push(subjectPool[index]);
        index++;
      }
      this.timeTableArray.push(row);
    }
  }

  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
