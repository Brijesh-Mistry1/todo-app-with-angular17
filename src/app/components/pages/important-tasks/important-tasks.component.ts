import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../page-title/page-title.component';
import { TaskListComponent } from '../../task-list/task-list.component';
import { HttpService } from '../../../services/http.service';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-important-tasks',
  standalone: true,
  imports: [PageTitleComponent, TaskListComponent],
  templateUrl: './important-tasks.component.html',
  styleUrl: './important-tasks.component.scss'
})
export class ImportantTasksComponent {
  newTask = '';
  taskList:any[]=[];
  initialtaskList:any[]=[];
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
      this.initialtaskList = this.taskList = result.filter((x:any)=>x.important==true);
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
}
