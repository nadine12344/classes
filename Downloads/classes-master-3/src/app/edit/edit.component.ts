import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit{
  dynamicForm: FormGroup;
  dialog=this.data.type;
  submitted = false;
  schools: string[] = [ "Cairo English School","School9","Egypt School" ];
    _selected = '';
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    onNoClick(): void {
       if(this.dialog==="Add")
       this.dialogRef.close([]);
       else
      this.dialogRef.close(this.data.element);
    }
    ngOnInit() {
      this.dynamicForm = this.formBuilder.group({
      
          classes: new FormArray([])
      });
  
  }

  // convenience getters for easy access to form fields
  get form() { return this.dynamicForm.controls; }
  get classes() { return this.form.classes as FormArray; }
  //getters and setters for selected
  get selected(): string {
    return this._selected;
  }
  set selected(value: string) {
    this._selected = value;
    if(this.dialog==="Add"){
    this.classes.push(this.formBuilder.group({
      id: [''],
      school:[this.selected],
      name: ['', Validators.required],
      Grade:['', Validators.required]
  }));}
  else{
   this.classes.clear();
    var filtered = this.selected ? this.performFilter(this.selected).concat() : [];
   filtered.forEach(item=>{
     this.classes.push(this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      school:[item.school],
      Grade:[item.Grade, Validators.required]
  })
     )
   })
  }}
  //add element
  addClass() {
    this.classes.push(this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      school:[this.selected],
      Grade:['', Validators.required]
  }));
  }
  //delete element
  removeClass(i:number) {
    this.classes.removeAt(i); 
  }

 
//filter array according to selected value
  performFilter(filterBy: string): { id: string; name: string; school: string; Grade: number; }[] {
    filterBy = filterBy.toLocaleLowerCase();
    return JSON.parse(JSON.stringify(this.data.element.filter((product: { id: string; name: string; school: string; Grade: number; }) =>
     product.school.toLocaleLowerCase().indexOf(filterBy) !== -1)));
  }
  //Apply changes and close
 done(){
   this.submitted=true;
   //stop here if invalid
  if (this.dynamicForm.invalid) {
    return;
}
if(this.dialog==="Add")
this.dialogRef.close(this.dynamicForm.value.classes);
else{
  var i=0; 
  for(var j=0; j < this.data.element.length;) {
    if(this.data.element[j].school === this.selected){
    if(this.dynamicForm.value.classes.length>i){
    this.data.element[j]=this.dynamicForm.value.classes[i];
    i++;}
    else{
    this.data.element.splice(j,1);
j--
 }  }
    j++;
  }
  while(i<this.dynamicForm.value.classes.length){
    this.data.element.push(this.dynamicForm.value.classes[i])
    i++;
  }
  this.dialogRef.close(this.data.element);
 }
}}
