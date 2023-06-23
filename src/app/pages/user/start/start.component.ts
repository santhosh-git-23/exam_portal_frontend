import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { QuestionService } from 'src/app/services/question.service';
import { QuizService } from 'src/app/services/quiz.service';
import { StartService } from 'src/app/services/start.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit{
  currentUser:any;
  currentQuiz:any;
  qid:any;
  questions:any;
  marksGot=0;
  correctAnswers=0;
  attempted=0;
  isSubmit=false;
  timer:any;

  resultData={
    quiz:{quid:''},
    user:{id:''},
    attempted:'',
    correctAnswers:'',
    marksGot:''
  };

  constructor(
    private locationSt:LocationStrategy,
    private _route:ActivatedRoute,
    private _question:QuestionService,
    private _login:LoginService,
    private _quiz:QuizService,
    private _start:StartService
  ){}
  ngOnInit(): void {
    this.qid=this._route.snapshot.params['quid'];
   this.preventBackButton();
   this.loadQuestions();
  }
  loadQuestions() {
    this._question.getQuestionOfQuizForTest(this.qid).subscribe((data:any)=>{
    this.questions=data;
    this.timer=this.questions.length*1*60;
    // this.questions.forEach((q:any)=>{
    //   q['givenAnswer']="";
    // });
    this.startTimer();
    },(error)=>{
      console.log(error);
      Swal.fire('Error','Error loading questions','error');
    });
  }
  preventBackButton(){
    history.pushState(null,'',location.href);
    this.locationSt.onPopState(()=>{
      history.pushState(null,'',location.href);
    });
  }

  submitQuiz(){
    Swal.fire({
      title:'Are you sure you want to submit the quiz?',
      showCancelButton:true,
      confirmButtonText:'Submit',
      denyButtonText:'No',
      icon:'question'
    }).then((e)=>{
      if(e.isConfirmed){
        this.evalQuiz();
      }
      console.log("Correct "+this.correctAnswers);
      console.log("Marks "+this.marksGot);
    });
  }

  startTimer(){
    let t=window.setInterval(()=>{
      if(this.timer<=0){
        this.evalQuiz();
        clearInterval(t);
      }else{
        this.timer--;
      }
    },1000)
  }

  getFormattedTime(){
    let hh=Math.floor(this.timer/3600);
    let mm=Math.floor(this.timer/60);
    let ss=this.timer-mm*60;
    return hh+" hr: "+mm+" min: "+ss+" sec";
  }
  evalQuiz() {
    console.log(this.questions);
    this._question.evalQuiz(this.questions).subscribe((data:any)=>{
      
      this.marksGot=parseFloat(Number(data.marksGot).toFixed(2));
      this.correctAnswers=data.correctAnswers;
      this.attempted=data.attempted;
      

      this._quiz.getQuiz(this.qid).subscribe((data:any)=>{
        this.resultData.quiz=data;
      });
      
      this._login.getCurrentUser().subscribe((data:any)=>{
        this.resultData.user=data;
      });
     
      this.resultData.attempted=data.attempted;
     this.resultData.correctAnswers=data.correctAnswers;
      this.resultData.marksGot=data.marksGot;
      console.log(this.resultData);
      this._start.addResult(this.resultData).subscribe((data:any)=>{
        console.log("hello bitch");
      });
     
      this.isSubmit=true;
    },(error)=>{
      console.log(error);
    });
   
  }

}
