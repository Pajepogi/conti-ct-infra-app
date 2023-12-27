import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialog,  MatDialogConfig,  MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ReasonForContact } from 'src/app/shared/enums/reasonForContact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  form = this.fb.group({
    message:['',[Validators.required,
    Validators.minLength(5),
    Validators.maxLength(10)]],
    category:['',Validators.required]
  })

  reasonForContactsEnum : any

  constructor(private fb: FormBuilder) {

  }



  ngOnInit() {
    this.reasonForContactsEnum = Object.values(ReasonForContact);
    this.reasonForContactsEnum.sort();
  }

  get messages() {
    return this.form.controls['message'];
  }

}
