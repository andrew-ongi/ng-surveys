import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  IBuilderOptions,
  NgSurveyState,
  BuilderOptionsModel,
  IElementAndOptionAnswers,
  NgSurveysService,
  IPageMap,
  NgSurveyStore,
  SurveyActionTypes,
  SurveyReducer
} from 'ng-surveys';
import {deserializeUtils} from '../../store/utils';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-builder-viewer-container',
  templateUrl: './builder-viewer-container.component.html',
  styleUrls: ['./builder-viewer-container.component.scss']
})
export class BuilderViewerContainerComponent implements OnInit, AfterViewInit {
  options: IBuilderOptions;
  ngSurveyState: NgSurveyState;

  constructor(private http: HttpClient, private _surveyReducer: SurveyReducer) { }

  async ngOnInit() {
    this.options = {
      surveyButtons: [{
        title: 'Save Survey to DB',
        icon: 'fas fa-save',
        text: 'Save',
        callback: this.saveSurvey,
      }],
      config: {
        hideSummary: true,
        redirect: '/thank-you2',
      },
    };

    // this.ngSurveyState = ngSurveyState;
    // this.ngSurveyState.survey.isLoading = true;
    // console.log("ngSurveyState", ngSurveyState);
    // this.surveyReducer.surveyReducer({
    //   type: '[Angular Surveys] Import survey state',
    //   payload: { ngSurveyState },
    // });
    // this.ngSurveyState.survey.isLoading = false;
    // this.surverStore.updateSurvey(ngSurveyState.survey);
    // this.surverStore.updatePages(ngSurveyState.pages);
    // this.surverStore.updateOptionAnswers(ngSurveyState.optionAnswers);
    // this.surverStore.updateBuilderOptions(ngSurveyState.builderOptions);
    // this.surverStore.updateElements(ngSurveyState.elements);
  }

  ngAfterViewInit() {
    const getSurveyState = this.importSurvey.bind(this);
    getSurveyState().subscribe(ngSurveyState => {
      ngSurveyState.survey.isLoading = true;
      setTimeout(() => {
        this._surveyReducer.surveyReducer({
          type: SurveyActionTypes.IMPORT_SURVEY_STATE_ACTION,
          payload: { ngSurveyState },
        });
      }, 300);
      // this.surverStore.updateSurvey(ngSurveyState.survey);
      // this.surverStore.updatePages(ngSurveyState.pages);
      // this.surverStore.updateOptionAnswers(ngSurveyState.optionAnswers);
      // this.surverStore.updateBuilderOptions(ngSurveyState.builderOptions);
      // this.surverStore.updateElements(ngSurveyState.elements);
    });
  }

  // loadSurvey(cb) {
  //   cb().subscribe(ngSurveyState => {
  //     ngSurveyState.survey.isLoading = true;
  //     this._surveyReducer.surveyReducer({
  //       type: SurveyActionTypes.IMPORT_SURVEY_STATE_ACTION,
  //       payload: { ngSurveyState },
  //     });
  //   });
  // }

  importSurvey(): Observable<NgSurveyState> {
    // Mocking get request
    return this.getSurvey();
  }

  importElement(): Observable<IElementAndOptionAnswers> {
    // Mocking get request
    return this.getElement();
  }

  getSurvey(): Observable<NgSurveyState> {
    // this.ngSurveyState.survey.isLoading = true;
    return this.http.get('assets/survey-data.json').pipe(map((res: NgSurveyState) => {
      const builderOptions = new BuilderOptionsModel();
      builderOptions.config = {
        hideSummary: true,
        redirect: '/thank-you',
      };
      return {
        survey: res.survey,
        pages: deserializeUtils.deserializePages(res.pages),
        elements: deserializeUtils.deserializeElements(res.elements),
        optionAnswers: deserializeUtils.deserializeOptionAnswersMaps(res.optionAnswers),
        builderOptions: builderOptions,
      };
    }));
  }

  getElement(): Observable<IElementAndOptionAnswers> {
    return this.http.get('assets/element-data.json').pipe(map((res: IElementAndOptionAnswers) => {
      return {
        element: res.element,
        optionAnswers: deserializeUtils.deserializeOptionAnswersMap(res.optionAnswers),
      };
    }));
  }

  saveSurvey(ngSurveyState: NgSurveyState): void {
    // Add post request to save survey data to the DB
    console.log('ngSurveyState: ', JSON.stringify(ngSurveyState));
  }

  saveElement(element: IElementAndOptionAnswers): void {
    // Add post request to save survey data to the DB
    console.log('element: ', element);
  }

}
