import { Component, inject } from '@angular/core';
import { TaskListComponent } from '../../task-list/task-list.component';
import { PageTitleComponent } from '../../page-title/page-title.component';
import { HttpService } from '../../../services/http.service';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [TaskListComponent, PageTitleComponent],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.scss'
})
export class CompletedTasksComponent {
  newTask = '';
  initialtaskList:any[]=[];
  taskList:any[]=[];
  httpService = inject(HttpService);
  stateService = inject(StateService);
  dateNow = new Date();

  ngOnInit(){
    this.stateService.searchSubject.subscribe((value)=> {

      if(value){
        this.taskList=this.initialtaskList.filter(x=>x.title.toLowerCase().includes(value.toLowerCase()))
      }
      else {
        this.taskList=this.initialtaskList;
      }

    })
    this.getAllTasks();
  }

  addTask(){
    this.httpService.addTask(this.newTask).subscribe(()=> {
      this.newTask = "";
      this.getAllTasks();
    })
  }

  getAllTasks(){
    this.httpService.getAllTasks().subscribe((result:any)=>{
      this.initialtaskList = this.taskList = result.filter((x:any)=>x.completed==true);
    })
  }

  onComplete(task:any){
    task.completed=true;
    this.httpService.updateTask(task).subscribe(()=> {})
  }

  onImportant(task:any){  
    task.important=true;
    this.httpService.updateTask(task).subscribe(()=> {})
  }

  onImComplete(task:any){
    task.completed=false;
    this.httpService.updateTask(task).subscribe(()=> {})
    this.ngOnInit();
  }

  onNotImportant(task:any){
    task.important=false;
    this.httpService.updateTask(task).subscribe(()=> {})
    this.ngOnInit();
  }
}
