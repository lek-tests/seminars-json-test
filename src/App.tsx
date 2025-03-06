import {useEffect, useState} from 'react'

import {deleteSeminar} from "./services/deleteSeminars.ts";
import {fetchSeminars} from "./services/fetchSeminars.ts";
import {Seminar} from "./services/types.ts";

import {Modal} from "./components/modal";

import './App.css'


function App() {
  const [seminarsList, setSeminarsList] = useState<Array<Seminar>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seminarToEdit, setSeminarToEdit] = useState<number | null>(null);
  const [seminarToDelete, setSeminarToDelete] = useState<number | null>(null);

  const openModal = (seminarId: number, actionType: 'edit' | 'delete') => {
      if (actionType === 'edit') {
        setSeminarToEdit(seminarId);
        setSeminarToDelete(null);
      }
      if (actionType === 'delete') {
          setSeminarToDelete(seminarId);
          setSeminarToEdit(null);
      }
      setIsModalOpen(true);

  };


  const closeModal = () => {
      setIsModalOpen(false);
      setSeminarToEdit(null);
      setSeminarToDelete(null);
  };

  const handleEdit = (updatedSeminar: Seminar) => {
      if (seminarToEdit) {
          setSeminarsList(seminarsList.map(seminar =>
              seminar.id === seminarToEdit ? updatedSeminar : seminar
          ));
          closeModal();
      }
  }

  const handleDelete = async () => {
      if (seminarToDelete !== null) {
            const success = await deleteSeminar(seminarToDelete);

            if (success) {
                setSeminarsList(seminarsList.filter(seminar => seminar.id !== seminarToDelete));
                closeModal();
            } else {
                alert('Не удалось удалить семинар');
            }
      }
    };

  useEffect(() => {
    const getData = async () => {
    try {
        const seminars: Seminar[] = await fetchSeminars();
        setSeminarsList(seminars || []);
    } catch (err) {
        setError('Не удалось загрузить семинары');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

    getData();
  }, []);

    if (loading) {
        return <div>Загружаю семинары...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

  return (
    <div className="container">
        <ul className="list">
            {seminarsList.map(seminar => (
                <li className="listItem" key={seminar.id}>
                    <img className="img" src={seminar.photo} alt={seminar.title}/>
                    <p className="title">{seminar.title}</p>
                    <p>Дата: {seminar.date}</p>
                    <p>Время: {seminar.time}</p>
                    <p>Описание: {seminar.description}</p>
                    <div className="btnContainer">
                        <button onClick={() => openModal(seminar.id, 'edit')} className="button">Редактировать</button>
                        <button onClick={() => openModal(seminar.id, 'delete')} className="button">Удалить</button>
                    </div>
                </li>
            ))}
        </ul>

        <Modal isOpen={isModalOpen}
               close={closeModal}
               onConfirm={seminarToEdit ? handleEdit : handleDelete}
               actionType={seminarToEdit ? 'edit' : 'delete'}
               seminar={seminarToEdit !== null ? seminarsList.find((s) => s?.id === seminarToEdit) : seminarToDelete !== null ? seminarsList.find((s) => s.id === seminarToDelete) : null}
        />
    </div>
  )
}

export default App;
