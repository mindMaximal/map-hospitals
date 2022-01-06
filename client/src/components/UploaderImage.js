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

    for (var value of formData.values()) {
      console.log(value);
    }

    fetchData(formData)
  }

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (data) => {
    try {
      for (var value of data.values()) {
        console.log(value);
      }
      const fetched = await request(
        `/api/upload/images/`,
        'POST',
        data,
        {},
        false
      )
      // ToDo: проверка авторизации по токену

      console.log(fetched)
    } catch (e) {}
  }, [request])

  return (
    <div
      className={`uploader ${loading || true ? 'uploader--loading' : ''} ${props.className}`}
    >
      <form className="uploader__form">
        <input
          type="file"
          onChange={handleInputFile}
        />
        {
          loading || true ?
            <Preloader
              color="blue"
              flashing={false}
              size="small"
          />:
            <Icon small>file_upload</Icon>
        }
      </form>
    </div>
  )
}