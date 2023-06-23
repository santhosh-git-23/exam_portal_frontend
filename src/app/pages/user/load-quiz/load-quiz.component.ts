import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-quiz',
  templateUrl: './load-quiz.component.html',
  styleUrls: ['./load-quiz.component.css']
})
export class LoadQuizComponent implements OnInit{
  catId:any;
  quizzes:any;
  code:any;
  constructor(
    private _route:ActivatedRoute,
    private _quiz:QuizService,
    private _snack:MatSnackBar,
    private _router:Router
  ){}
  ngOnInit(): void {
    
    this._route.params.subscribe((params)=>{
      this.catId=params['catId'];
      if(this.catId==0){
        this._quiz.getActiveQuizzes().subscribe((data:any)=>{
          this.quizzes=data;
          console.log(this.quizzes);
        },(error)=>{
          this._snack.open("Error in loading data",'',{
            duration:3000
          });
        });
      }else{
        this._quiz.getActiveQuizzesOfCategory(this.catId).subscribe((data:any)=>{
          this.quizzes=data;
        },(error)=>{
          alert('Error');
        });
      }
    });
    
  }

  quizCode(qid:any){
    Swal.fire({
      title: "Please enter the code to start",
      text: "Type the code shared by your instructor:",
      input: 'number',
          
  }).then((result) => {
      if (result.value==qid) {
          this._router.navigate(['/user-dashboard/instructions/'+qid]);
      }
      else if(result.value!=qid){
        this._snack.open("Code entered is incorrect",'OK');
      }
      
  });
  }

}
