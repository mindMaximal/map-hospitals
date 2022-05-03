import {Icon, Preloader} from "react-materialize";
import React, {useCallback, useEffect} from "react";
import './UploaderImage.scss'
import {useHttp} from "../hooks/http.hook";

export const UploaderImage = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const handleInputFile = (e) => {
    e.preventDefault()

    const formData = new FormData()
    const { files } = e.target

    for (let i = 0; i < files.length; i++) {
      formData.append('filedata', files.item(i))
    }

    formData.append('id', props.id)

    fetchData(formData)

    e.target.type = 'text'
    e.target.type = 'file'
  }

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (data) => {
    try {
      const fetched = await request(
        `/api/upload/images/`,
        'POST',
        data,
        {},
        false
      )
      // ToDo: проверка авторизации по токену

      if (!fetched.image) {
        // ToDo: обработка ошибок
        console.log('Ошибка')
      }

      props.setImages(fetched.image)

    } catch (e) {}
  }, [request])

  return (
    <div
      className={`uploader ${loading ? 'uploader--loading' : ''} ${props.className}`}
    >
      <form className="uploader__form">
        <input
          type="file"
          onChange={handleInputFile}
        />
        {
          loading ?
            <Preloader
              color="blue"
              flashing={false}
              size="small"
          />:
            <Icon small>add_a_photo</Icon>
        }
      </form>
    </div>
  )
}