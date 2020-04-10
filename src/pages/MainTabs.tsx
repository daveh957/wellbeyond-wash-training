import React  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { book, help } from 'ionicons/icons';
import TrainingPage from './TrainingPage';
import Subject from './SubjectPage';
import LessonDetail from './LessonDetail';

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/training" />
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
        <Route path="/tabs/training" render={() => <TrainingPage />} exact={true} />
        <Route path="/tabs/subjects/:id" component={Subject} exact={true} />
        <Route path="/tabs/lessons/:id" component={LessonDetail} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="training" href="/tabs/training">
          <IonIcon icon={book} />
          <IonLabel>Training</IonLabel>
        </IonTabButton>
        <IonTabButton tab="support" href="/support">
          <IonIcon icon={help} />
          <IonLabel>Support</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
