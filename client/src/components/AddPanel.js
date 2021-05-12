import {Button, Checkbox, Modal, Select, TextInput} from "react-materialize"
import React from 'react'
import './AddPanel.scss'

export const AddPanel = (props) => {

  const handleInputFile = (e) => {
    const { target } = e
    const { files } = target

    try {
      let file = files[0]

      const url = URL.createObjectURL(file)
      console.log(url)

      const img = target.closest('.add-panel__block').querySelector('img')

      img.src = url
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Modal
      actions={[
        <Button
          node="button"
          waves="light"
        >
          Добавить
        </Button>,
        <Button
          modal="close"
          node="button"
          waves="light"
          className="red darken-3"
        >
          Закрыть
        </Button>
      ]}
      bottomSheet={false}
      fixedFooter={false}
      className="add-panel"
      id="context-menu-add-modal"
      open={false}
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%'
      }}
    >

      <div className="add-panel__wrapper">

        <div className="add-panel__header">

          <h3 className="add-panel__title">
            Добавление мед. пункта
          </h3>

        </div>

        <div className="add-panel__body">


          <div className="add-panel__row">

            <div className="add-panel__column">
              <div className="add-panel__block">

                <Select
                  id="report-area"
                  className="add-panel__select"
                  multiple={false}
                  onChange
                  options={{
                    classes: '',
                    dropdownOptions: {
                      alignment: 'left',
                      autoTrigger: true,
                      closeOnClick: true,
                      constrainWidth: true,
                      coverTrigger: true,
                      hover: false,
                      inDuration: 150,
                      onCloseEnd: null,
                      onCloseStart: null,
                      onOpenEnd: null,
                      onOpenStart: null,
                      outDuration: 250
                    }
                  }}
                  value=""
                >
                  <option
                    disabled
                    value=""
                  >
                    Выберите область
                  </option>
                  {
                    <option
                      key={1}
                      value={'123'}
                    >
                      {'123'}
                    </option>
                  }
                </Select>

              </div>

              <div className="add-panel__block">

                <Select
                  id="report-district"
                  className="add-panel__select"
                  multiple={false}
                  onChange
                  options={{
                    classes: '',
                    dropdownOptions: {
                      alignment: 'left',
                      autoTrigger: true,
                      closeOnClick: true,
                      constrainWidth: true,
                      coverTrigger: true,
                      hover: false,
                      inDuration: 150,
                      onCloseEnd: null,
                      onCloseStart: null,
                      onOpenEnd: null,
                      onOpenStart: null,
                      outDuration: 250
                    }
                  }}
                  value=""
                >
                  <option
                    disabled
                    value=""
                  >
                    Выберите район
                  </option>
                  {
                    <option
                      key={1}
                      value={'123'}
                    >
                      {'123'}
                    </option>
                  }
                </Select>

              </div>

              <div className="add-panel__block">

                <Select
                  id="report-medical-institution"
                  className="add-panel__select"
                  multiple={false}
                  onChange
                  options={{
                    classes: '',
                    dropdownOptions: {
                      alignment: 'left',
                      autoTrigger: true,
                      closeOnClick: true,
                      constrainWidth: true,
                      coverTrigger: true,
                      hover: false,
                      inDuration: 150,
                      onCloseEnd: null,
                      onCloseStart: null,
                      onOpenEnd: null,
                      onOpenStart: null,
                      outDuration: 250
                    }
                  }}
                  value=""
                >
                  <option
                    disabled
                    value=""
                  >
                    Выберите населенный пункт
                  </option>
                  {
                    <option
                      key={1}
                      value={'123'}
                    >
                      {'123'}
                    </option>
                  }
                </Select>

              </div>

              <div className="add-panel__block">

                <Select
                  id="report-medical-institution"
                  className="add-panel__select"
                  multiple={false}
                  onChange
                  options={{
                    classes: '',
                    dropdownOptions: {
                      alignment: 'left',
                      autoTrigger: true,
                      closeOnClick: true,
                      constrainWidth: true,
                      coverTrigger: true,
                      hover: false,
                      inDuration: 150,
                      onCloseEnd: null,
                      onCloseStart: null,
                      onOpenEnd: null,
                      onOpenStart: null,
                      outDuration: 250
                    }
                  }}
                  value=""
                >
                  <option
                    disabled
                    value=""
                  >
                    Выберите мед. учереждение
                  </option>
                  {
                    <option
                      key={1}
                      value={'123'}
                    >
                      {'123'}
                    </option>
                  }
                </Select>

              </div>

              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-name"
                  label="Название мед. пункта"
                />

              </div>

              <div className="add-panel__block">

                <Select
                  id="report-type"
                  className="add-panel__select"
                  multiple={false}
                  onChange
                  options={{
                    classes: '',
                    dropdownOptions: {
                      alignment: 'left',
                      autoTrigger: true,
                      closeOnClick: true,
                      constrainWidth: true,
                      coverTrigger: true,
                      hover: false,
                      inDuration: 150,
                      onCloseEnd: null,
                      onCloseStart: null,
                      onOpenEnd: null,
                      onOpenStart: null,
                      outDuration: 250
                    }
                  }}
                  value=""
                >
                  <option
                    disabled
                    value=""
                  >
                    Выберите тип мед. пункта
                  </option>
                  {
                    <option
                      key={1}
                      value={'123'}
                    >
                      {'123'}
                    </option>
                  }
                </Select>

              </div>
            </div>

            <div className="add-panel__column">
              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-street"
                  label="Улица"
                />

              </div>

              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-house-number"
                  label="Номер дома"
                />

              </div>

              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-latitude"
                  label="Широта"
                />

              </div>

              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-longitude"
                  label="Долгота"
                />

              </div>

              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-phone"
                  label="Номер телефона"
                />

              </div>

              <div className="add-panel__block">

                <TextInput
                  className="add-panel__input"
                  id="add-panel-input-foundation-year"
                  label="Год основания"
                />

              </div>
            </div>


            <div className="add-panel__column">
              <div className="add-panel__block add-panel__block--height">

                <div className="input-field col">
                  <TextInput
                    id="add-panel-input-photo"
                    label="Фото"
                    type="file"
                    onChange={handleInputFile}
                  />
                </div>

                <img src="" alt="Photo"/>

              </div>

              <div className="add-panel__block add-panel__block--height">

                <div className="input-field col">
                  <Checkbox
                    filledIn
                    id="add-panel-first-aid"
                    label="Первая помощь"
                    name="first-aid"
                  />
                </div>

              </div>

              <div className="add-panel__block add-panel__block--height">

                <div className="input-field col">
                  <Checkbox
                    filledIn
                    id="add-panel-emergency-assistance"
                    label="Экстренная помощь"
                    name="emergency-assistance"
                  />
                </div>

              </div>


              <div className="add-panel__block add-panel__block--height">

                <div className="input-field col">
                  <Checkbox
                    filledIn
                    id="add-panel-pharmacy"
                    label="Аптека"
                    name="pharmacy"
                  />
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

    </Modal>
  )
}