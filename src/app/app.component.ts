import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { EditComponent } from './edit/edit.component';
import { OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isCollapsed=true;
  theme="demo1";
  type="Add"
  elements = [{id:"C.1",name:"Old Class Name 1",school:"Cairo English School",Grade: 3},{id:"C.2",name:"Old Class Name 2",school:"School9",Grade: 2},{id:"C.4",name:"Old Class Name 4",school:"School9",Grade: 4},
  {id:"C.3",name:"Old Class Name 3",school:"Egypt School",Grade: 5}];
  title = 'class';
  filtered: { id: string; name: string; school: string; Grade: number; }[]=this.elements;
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filtered = this.listFilter ? this.performFilter(this.listFilter) : this.elements;
  }
  constructor(public dialog: MatDialog,public overlayContainer: OverlayContainer){}
  //filter array according to search
  performFilter(filterBy: string): { id: string; name: string; school: string; Grade: number; }[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.elements.filter((product: { id: string; name: string; school: string; Grade: number; }) =>
      product.name.toLocaleLowerCase().indexOf(filterBy) !== -1|| product.id.toLocaleLowerCase().indexOf(filterBy) !== -1||product.school.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  
  //open edit/add dialog
  openDialog() {
    const dialogRef = this.dialog.open(EditComponent,{height:'630px',width:'960px', data: {element: this.elements,type: this.type}});
    dialogRef.afterClosed().subscribe(result => {
      if(this.type==="Add"){
        this.elements = this.elements.concat(result);
        this.filtered=this.elements;
      }
      else{
      this.elements = result;
      this.filtered=this.elements;}
    });
  }
  change(){
    if(this.theme==="demo1")
    this.theme="demo2";
    else
    this.theme="demo1"

  }
 _opened: boolean = false;
 
 _toggleSidebar() {
    this._opened = !this._opened;
  }
}
