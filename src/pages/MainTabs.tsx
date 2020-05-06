import React from 'react';
import {IonRouterOutlet} from '@ionic/react';
import {Redirect, Route} from 'react-router';
import TrainingPage from './TrainingPage';
import SubjectPage from './SubjectPage';
import LessonPage from './LessonPage';

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
        <Route path="/tabs/subjects/:subjectId/lessons/:lessonId" component={LessonPage} exact={true} />
      </IonRouterOutlet>
  );
};

export default MainTabs;
