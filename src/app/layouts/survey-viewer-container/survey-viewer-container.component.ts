import {AfterViewInit, Component, OnInit} from '@angular/core';
import {
  NgSurveyState,
  NgSurveysService,
  IPageMap, IBuilderOptions, SurveyReducer, SurveyActionTypes, IElementAndOptionAnswers, BuilderOptionsModel,
} from 'ng-surveys';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {deserializeUtils} from '../../store/utils';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-survey-viewer-container',
  templateUrl: './survey-viewer-container.component.html',
  styleUrls: ['./survey-viewer-container.component.scss']
})
export class SurveyViewerContainerComponent implements OnInit, AfterViewInit {
  ngSurveyState: NgSurveyState;
  pages: IPageMap;
  options: IBuilderOptions;
  isLoaded = false;

  constructor(private ngSurveys$: NgSurveysService, private _surveyReducer: SurveyReducer, private http: HttpClient) {
    const getSurveyState = this.importSurvey.bind(this);
    getSurveyState().subscribe(ngSurveyState => {
      ngSurveyState.survey.isLoading = true;
      setTimeout(() => {
        this._surveyReducer.surveyReducer({
          type: SurveyActionTypes.IMPORT_SURVEY_STATE_ACTION,
          payload: { ngSurveyState },
        });
        console.log('ok1');
        this.isLoaded = true;
      }, 300);
      console.log('ok2');
    });
  }

  ngOnInit() {
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

    this.ngSurveys$.getNgSurveyState().subscribe(res => {
      this.ngSurveyState = res;
      // console.log('getNgSurveyState', JSON.stringify(res));
    });

    this.ngSurveys$.getSurveyChanges().subscribe(res => {
      // console.log('getSurveyChanges', JSON.stringify(res));
    });

    this.ngSurveys$.getPagesChanges().subscribe(pagesRes => {
      this.pages = pagesRes;
      // console.log('getPagesChanges', JSON.stringify(pagesRes));
    });

    this.ngSurveys$.getElementsChanges().subscribe(data => {
      console.log('getElementsChanges', JSON.stringify(data));
    });

    this.ngSurveys$.getOptionAnswersChanges().subscribe(data => {
      console.log('getOptionAnswersChanges', JSON.stringify(data));
    });
  }

  ngAfterViewInit() {
  }
  importSurvey(): Observable<NgSurveyState> {
    // Mocking get request
    return this.getSurvey();
  }

  saveSurvey(ngSurveyState: NgSurveyState): void {
    // Add post request to save survey data to the DB
    console.log('ngSurveyState: ', JSON.stringify(ngSurveyState));
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
}
