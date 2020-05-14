import React, {useContext, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow, IonSelect, IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import english from '../i18n/en';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {Lesson, Subject, TrainingSession} from "../models/Training";
import * as selectors from "../data/selectors";
import BackToSubjectLink from "../components/BackToSubject";
import {startTrainingSession} from "../data/training/training.actions";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  userId?: string;
}

interface DispatchProps {
  startTrainingSession: typeof startTrainingSession;
}

interface StartTrainingSessionProps extends OwnProps, StateProps, DispatchProps { }

const StartTrainingSession: React.FC<StartTrainingSessionProps> = ({subject, lessons, userId, startTrainingSession }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [serverError, setServerError] = useState<Error>();

  const handleChange = (field:string, value:string) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    values[field] = value;
    setFormErrors(errors);
    setFormValues(values);
  }
  const validate = ():boolean => {
    let errors = {...formErrors};
    errors.location = formValues.location ? null : 'training.errors.locationRequired';
    errors.groupType = formValues.groupType ? null : 'training.errors.groupTypeRequired';
    errors.groupSize = formValues.groupSize ? null : 'training.errors.groupSizeRequired';
    setFormErrors(errors);
    const valid = !Object.values(errors).some(x => (x !== null && x !== ''));
    return valid;
  }

  const startNewTrainingSession = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (validate()) {
      let session: TrainingSession = {
        subjectId: subject.id,
        userId: userId || '',
        started: new Date(),
        archived: false,
        location: formValues.location,
        groupType: formValues.groupType,
        groupSize: formValues.groupSize,
        lessons: {}
      };
      session.id = userId + ':' + session.subjectId + ':' + (session.started && session.started.getTime());
      lessons.map((l) => {
        if (session.lessons && l.id) {
          session.lessons[l.id] = {
            id: l.id,
            lessonId: l.id,
            answers: [],
            pageViews: []
          };
        }
      });
      startTrainingSession(session);
      navigate('/tabs/subjects/' + subject.id + '/progress?tsId=' + session.id);
    }
  }

  return (
    <IonPage id="start-session-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSubjectLink subject={subject}/>
          </IonButtons>
          <IonTitle>{t('training.pages.start')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={startNewTrainingSession}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">{t('training.labels.location')}</IonLabel>
              <IonInput name="location" type="text" value={formValues.location} spellCheck={false} autocapitalize="on" required={true} onIonChange={e => {
                handleChange('location', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.location && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.location)}
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('training.labels.groupType')}</IonLabel>
              <IonSelect value={formValues.groupType}
                         placeholder={t('training.groupTypes.selectOne')}
                         cancelText={t('training.buttons.cancel')}
                         okText={t('training.buttons.ok')}
                         onIonChange={e => {handleChange('groupType', e.detail.value!);}}>
                <IonSelectOption value={english.translation.training.groupTypes.committee}>{t('training.groupTypes.committee')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupTypes.household}>{t('training.groupTypes.household')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupTypes.school}>{t('training.groupTypes.school')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupTypes.clinic}>{t('training.groupTypes.clinic')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupTypes.other}>{t('training.groupTypes.other')}</IonSelectOption>
              </IonSelect>
            </IonItem>

            {formSubmitted && formErrors.location && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.groupType)}
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('training.labels.groupSize')}</IonLabel>
              <IonSelect value={formValues.groupSize}
                         placeholder={t('training.groupSizes.selectOne')}
                         cancelText={t('training.buttons.cancel')}
                         okText={t('training.buttons.ok')}
                         onIonChange={e => {handleChange('groupSize', e.detail.value!);}}>
                <IonSelectOption value={english.translation.training.groupSizes.xs}>{t('training.groupSizes.xs')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupSizes.sm}>{t('training.groupSizes.sm')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupSizes.md}>{t('training.groupSizes.md')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupSizes.lg}>{t('training.groupSizes.lg')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupSizes.xl}>{t('training.groupSizes.xl')}</IonSelectOption>
                <IonSelectOption value={english.translation.training.groupSizes.xxl}>{t('training.groupSizes.xxl')}</IonSelectOption>
              </IonSelect>
            </IonItem>

            {formSubmitted && formErrors.location && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.groupSize)}
              </p>
            </IonText>}

          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('training.buttons.beginTraining')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    startTrainingSession
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    userId: selectors.getUserId(state),
  }),
  component: StartTrainingSession
})
