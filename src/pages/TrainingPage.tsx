import React, {useRef} from 'react';

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonItemGroup,
  IonList,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import './TrainingPage.scss'

import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import * as selectors from '../data/selectors';
import {connect} from '../data/connect';
import {Subject} from '../models/Training';
import SubjectItem from "../components/SubjectItem";
import {Redirect} from "react-router-dom";

interface OwnProps {
}

interface StateProps {
  subjects: Subject[],
}

interface DispatchProps {
}

type TrainingPageProps = OwnProps & StateProps & DispatchProps;

const TrainingPage: React.FC<TrainingPageProps> = ({ subjects, }) => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );

  if (subjects && subjects.length === 1) {
    return <Redirect to={`/tabs/subjects/${subjects[0].id}`} />
  }

  return (
    <IonPage ref={pageRef} id="subject-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t('resources.subjects.name_plural')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        {subjects && subjects.length ?
          (<IonList>
            {subjects.map((subject, index: number) => (
              <IonItemGroup key={`subject-${index}`}>
                <IonItemDivider sticky>
                  <SubjectItem subject={subject} />
                </IonItemDivider>
              </IonItemGroup>))
            }
          </IonList>)
        :
          <IonLoading
            isOpen={!subjects}
            message={'Please wait...'}
            duration={5000}
          />
        }
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    subjects: selectors.getSubjects(state),
  }),
  component: React.memo(TrainingPage)
});
