import React, {useState} from 'react';
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
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {connect} from "../data/connect";
import {updateProfile} from "../data/user/userApi";
import {ToastProps} from "../pages/Account";

interface OwnProps {
  photo?: string,
  showModal: boolean,
  closeModal(): void,
  showToast(props:ToastProps): void
}

interface StateProps {
}

interface DispatchProps {
}

interface ChangePhotoProps extends OwnProps, StateProps, DispatchProps { }

const ChangePhotoModal: React.FC<ChangePhotoProps> = ({showModal, closeModal, photo, showToast}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({
    photo: '',
    photoRepeat: '',
  });
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
    errors.photo = formValues.photo ? null : 'registration.errors.photoRequired';
    setFormErrors(errors);
    const valid = !Object.values(errors).some(x => (x !== null && x !== ''));
    return valid;
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      updateProfile({photoURL: formValues.photo}).then((result) => {
        showToast({message: t('registration.messages.photoChanged')});
        closeModal();
      })
        .catch((error) => {
          setServerError(error);
        });
    }
  };

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('registration.modals.changePhoto')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={save}>
          <IonList>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.newPhoto')}</IonLabel>
              <IonInput name="photo" type="text" value={formValues.photo} minlength={8} required={true} onIonChange={e => {
                handleChange('photo', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.photo && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.photo)}
              </p>
            </IonText>}
          </IonList>

          {formSubmitted && serverError && <IonText color="danger">
            <p className="ion-padding-start">
              {serverError.message}
            </p>
          </IonText>}

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.changePhoto')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>
    </IonModal>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: ChangePhotoModal
})
