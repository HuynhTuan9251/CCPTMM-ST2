import React from 'react';
import './about.css';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="main">
      <div className="elementor elementor-158">
        <section className="elementor-section elementor-top-section">
          <div className="elementor-container">
            <div className="elementor-column elementor-col-100 animated slideInDown">
              <div className="elementor-widget-wrap">
                <div className="elementor-spacer">
                  <div className="elementor-spacer-inner"></div>
                </div>
                <div className="elementor-widget elementor-widget-image">
                  <div className="elementor-widget-container">
                    <img
                      decoding="async"
                      width="1536"
                      height="569"
                      src="https://katinat.vn/wp-content/uploads/2024/04/KAT_NEWBRANDING_COVERFB_3-1536x569.jpg"
                      alt="Katinat Banner"
                      className="elementor-animation-grow"
                    />
                  </div>
                </div>
                <div className="elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h1 className="elementor-heading-title elementor-size-xxl">
                      {t('journeyTitle')}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="elementor-section elementor-top-section elementor-element elementor-element-0dbe7ec elementor-section-boxed elementor-section-height-default">
          <div className="elementor-container elementor-column-gap-default">
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-3cea7aa">
              <div className="elementor-widget-wrap elementor-element-populated">
                <div className="elementor-element elementor-element-7f7baa5 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <h1 className="center" style={{ color: '#bc9369', fontSize: '60px', fontWeight: 'bold', textAlign: 'center' }}>
                      <span style={{ color: '#bc9369' }}>8</span>
                    </h1>
                    <div>
                      <h4 style={{ lineHeight: '1.33333em', fontSize: '1.53333em', textAlign: 'center' }}>
                        <span style={{ color: '#114358' }}>{t('yearsJourney')}</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-62a3c56">
              <div className="elementor-widget-wrap elementor-element-populated">
                <div className="elementor-element elementor-element-3accf60 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <h1 className="center" style={{ color: '#bc9369', fontSize: '60px', fontWeight: 'bold', textAlign: 'center' }}>
                      <span style={{ color: '#bc9369' }}>10</span>
                    </h1>
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                        <span style={{ color: '#114358' }}>{t('provinces')}</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-406fa01">
              <div className="elementor-widget-wrap elementor-element-populated">
                <div className="elementor-element elementor-element-185bbd7 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <h1 className="center" style={{ color: '#bc9369', fontSize: '60px', fontWeight: 'bold', textAlign: 'center' }}>
                      <span style={{ color: '#bc9369' }}>70+</span>
                    </h1>
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                        <span style={{ color: '#114358' }}>{t('storesNationwide')}</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="elementor-section elementor-top-section elementor-element elementor-element-322d6ba elementor-section-boxed elementor-section-height-default">
          <div className="elementor-container elementor-column-gap-default">
            <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-efd9bbd">
              <div className="elementor-widget-wrap elementor-element-populated">
                <div className="elementor-element elementor-element-dcf4b1d elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      <span style={{ color: '#bf9972', fontFamily: "'Fira Sans', sans-serif", fontSize: '17px' }}>
                        {t('introText')}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-e8f7972 elementor-widget elementor-widget-spacer">
                  <div className="elementor-widget-container">
                    <div className="elementor-spacer">
                      <div className="elementor-spacer-inner"></div>
                    </div>
                  </div>
                </div>

                <section className="elementor-section elementor-inner-section elementor-element elementor-element-7f8aed2 elementor-section-boxed elementor-section-height-default">
                  <div className="elementor-container elementor-column-gap-default" style={{ display: 'flex' }}>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-57ddc36">
                      <div className="elementor-widget-wrap elementor-element-populated">
                        <div className="elementor-element elementor-element-94d083b elementor-widget elementor-widget-heading">
                          <div className="elementor-widget-container">
                            <h2 style={{ fontFamily: 'Sans-serif', color: '#bf9972', fontSize: '80px' }}>{t('coffee')}</h2>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-cbc8447 elementor-widget elementor-widget-text-editor">
                          <div className="elementor-widget-container">
                            <h6 style={{ lineHeight: '1.33333em', fontSize: '1.13333em' }}>
                              <span style={{ color: '#14445c' }}>{t('coffeeDescription')}</span>
                            </h6>
                            <ul>
                              <li style={{ lineHeight: '1.33333em', fontSize: '1.13333em' }}>
                                <span style={{ color: '#14445c' }}>
                                  <span style={{ color: '#ba916a' }}><strong>{t('espresso')}</strong></span> – {t('espressoDescription')}
                                </span>
                              </li>
                            </ul>
                            <ul>
                              <li style={{ lineHeight: '1.33333em', fontSize: '1.13333em' }}>
                                <span style={{ color: '#14445c' }}>
                                  <span style={{ color: '#ba916a' }}><strong>{t('phinMe')}</strong></span> – {t('phinMeDescription')}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-a21ef26 elementor-widget elementor-widget-button">
                          <div className="elementor-widget-container">
                            <div className="elementor-button-wrapper">
                              <a href="/menu" className="elementor-button-link elementor-button elementor-size-md" role="button">
                                <span className="elementor-button-content-wrapper">
                                  <span className="elementor-button-text">{t('menu')}</span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-4662ce9">
                      <div className="elementor-widget-wrap elementor-element-populated">
                        <div className="elementor-element elementor-element-beafbcd elementor-widget elementor-widget-image">
                          <div className="elementor-widget-container">
                            <img
                              loading="lazy"
                              decoding="async"
                              width="800"
                              height="800"
                              src="https://katinat.vn/wp-content/uploads/2024/04/z5340844318458_d7b033c33f63b8b449759296691e9fcb.jpg"
                              alt=""
                              className="attachment-large size-large"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="elementor-element elementor-element-2d6e299 elementor-widget elementor-widget-spacer">
                  <div className="elementor-widget-container">
                    <div className="elementor-spacer">
                      <div className="elementor-spacer-inner"></div>
                    </div>
                  </div>
                </div>

                <section className="elementor-section elementor-inner-section elementor-element elementor-element-523447b elementor-section-boxed elementor-section-height-default">
                  <div className="elementor-container elementor-column-gap-default" style={{ display: 'flex' }}>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-10225c5">
                      <div className="elementor-widget-wrap elementor-element-populated">
                        <div className="elementor-element elementor-element-00eefac elementor-widget elementor-widget-heading">
                          <div className="elementor-widget-container">
                            <h2 style={{ lineHeight: '1.33333em', fontFamily: 'Sans-serif', color: '#bf9972', fontSize: '80px' }}>{t('tea')}</h2>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-ff9b749 elementor-widget elementor-widget-text-editor">
                          <div className="elementor-widget-container">
                            <h6 style={{ lineHeight: '1.33333em', fontSize: '1.13333em' }}>
                              <span style={{ color: '#14445c', fontFamily: 'Sans-serif' }}>{t('teaDescription')}</span>
                            </h6>
                            <ul>
                              <li style={{ lineHeight: '1.33333em', fontSize: '1.13333em' }}>
                                <span style={{ color: '#14445c' }}>
                                  <span style={{ color: '#ba916a' }}><strong>{t('milkTea')}</strong></span> – {t('milkTeaDescription')}
                                </span>
                              </li>
                            </ul>
                            <ul>
                              <li style={{ lineHeight: '1.33333em', fontSize: '1.13333em' }}>
                                <span style={{ color: '#14445c' }}>
                                  <span style={{ color: '#ba916a' }}><strong>{t('fruitTea')}</strong></span> – {t('fruitTeaDescription')}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-b983040 elementor-widget elementor-widget-button">
                          <div className="elementor-widget-container">
                            <div className="elementor-button-wrapper">
                              <a href="/menu" className="elementor-button-link elementor-button elementor-size-md" role="button">
                                <span className="elementor-button-content-wrapper">
                                  <span className="elementor-button-text">{t('menu')}</span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-7af6024">
                      <div className="elementor-widget-wrap elementor-element-populated">
                        <div className="elementor-element elementor-element-c2d4028 elementor-widget elementor-widget-image">
                          <div className="elementor-widget-container">
                            <img
                              loading="lazy"
                              decoding="async"
                              width="800"
                              height="800"
                              src="https://katinat.vn/wp-content/uploads/2024/04/z5340931351976_648f57132c98d668ea5b3c2b71529bd3-465x367.jpg"
                              alt=""
                              className="attachment-large size-large"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="elementor-element elementor-element-e7903d5 elementor-widget elementor-widget-spacer">
                  <div className="elementor-widget-container">
                    <div className="elementor-spacer">
                      <div className="elementor-spacer-inner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="elementor-section elementor-top-section elementor-element elementor-element-f17f893 elementor-section-boxed elementor-section-height-default">
          <div className="elementor-container elementor-column-gap-default">
            <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-488b15f">
              <div className="elementor-widget-wrap elementor-element-populated">
                <div className="elementor-element elementor-element-c053b6f elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <h6 style={{ textAlign: 'center' }}>
                      <span style={{ color: '#14445c' }}>
                        {t('introText')}
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="elementor-element elementor-element-2542b9e elementor-widget elementor-widget-spacer">
                  <div className="elementor-widget-container">
                    <div className="elementor-spacer">
                      <div className="elementor-spacer-inner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;