import React from 'react';
import {IonRouterOutlet} from '@ionic/react';
import {Redirect, Route} from 'react-router';
import TrainingPage from './TrainingPage';
import SubjectPage from './SubjectPage';
import LessonIntroPage from './LessonIntroPage';
import LessonSummaryPage from './LessonSummaryPage';
import LessonPage from './LessonPage';
import QuestionPage from './QuestionPage';

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {

  return (
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/training" />
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
        <Route path="/tabs/training" render={() => <TrainingPage />} exact={true} />
        <Route path="/tabs/subjects/:subjectId" component={SubjectPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/intro" component={LessonIntroPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/summary" component={LessonSummaryPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/page/:pageId" component={LessonPage} exact={true} />
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId/question/:questionId/:preview" component={QuestionPage} exact={true} />
      </IonRouterOutlet>
  );
};

export default MainTabs;
