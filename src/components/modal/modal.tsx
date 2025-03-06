import {createPortal} from "react-dom";
import {useState} from "react";

import {Seminar} from "../../services/types.ts";

import styles from './modal.module.css'

interface ModalProps {
    isOpen: boolean;
    close: () => void;
    onConfirm: (seminar: Seminar) => void;
    actionType: 'edit' | 'delete';
    seminar: Seminar
}

export const Modal = ({ isOpen, close, onConfirm, actionType, seminar }: ModalProps) => {

    if (!isOpen || !seminar) return null;

    const [title, setTitle] = useState(seminar?.title || '');
    const [description, setDescription] = useState(seminar?.description || '');
    const [date, setDate] = useState(seminar?.date || '');
    const [time, setTime] = useState(seminar?.time || '');

    const handleConfirm = () => {
        if (seminar) {
            const updatedSeminar = { ...seminar, title, description, date, time };
            onConfirm(updatedSeminar);
        }
    };


    return createPortal(
        <div className={styles.modalBackdrop}>
            <div className={styles.modalStyle}>

                {actionType === 'edit' ?
                    <div className={styles.innerContainer}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Название семинара"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание"
                        />
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Дата"
                        />
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="Время"
                        />
                    </div> :
                    <>
                        <p>Вы уверены, что хотите удалить семинар "{seminar.title}"?</p>
                    </>}

                <div className={styles.btnContainer}>
                    <button onClick={handleConfirm}>{actionType === 'edit' ? 'Сохранить' : 'Удалить'}</button>
                    <button onClick={close}>Закрыть</button>
                </div>

            </div>
        </div>,
        document.body
    );
}
