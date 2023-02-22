import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/model/student';
import { StudentService } from 'src/app/service/student.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  student: Student;

  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService) {
    this.student = new Student();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // build student form
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.title = "Add Student";
    if (this.id) {
      // edit mode
      this.title = "Edit Student";
      this.loading = true;
      this.studentService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.form.patchValue(x);
          this.loading = false;
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    this.saveStudent();
    this.router.navigate(['/students']);
  }

  private saveStudent() {
    // create or update student based on id param
    return this.id
      ? this.studentService.update(this.id!, this.form.value)
      : this.studentService.register(this.form.value);
  }
}