import React from 'react';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonIcon,} from '@ionic/react';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";

interface ImageZoomProps {
  image: string,
  title: string,
  showModal: boolean,
  closeModal(): void
}

const ImageZoomModal: React.FC<ImageZoomProps> = ({ showModal, closeModal, image, title}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  return (
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={closeModal}>
                {t('buttons.close')}
              </IonButton>
            </IonButtons>
            <IonTitle>{t('resources.lessons.imageZoom')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <TransformWrapper
            defaultScale={1}
          >
            {({ zoomIn, zoomOut, resetTransform }:any) => (
              <React.Fragment>
                <div className="tools">
                  <IonButton onClick={zoomIn} color='medium'>
                    <IonIcon src={'/assets/img/zoom-in.svg'} />
                  </IonButton>
                  <IonButton onClick={zoomOut} color='medium'>
                    <IonIcon src={'/assets/img/zoom-out.svg'} />
                  </IonButton>
                </div>
                <TransformComponent>
                  <div style={{padding: '100px 0 300px 0'}}>
                    <img src={image} alt={title} crossOrigin='anonymous'/>
                  </div>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </IonContent>
      </IonModal>
  );
};

export default ImageZoomModal;
