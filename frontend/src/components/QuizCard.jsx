import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCall from '../util/ApiCall';
import Popup from './Popup';

const QuizCard = (prop) => {
  // const [status, setStatus] = React.useState('start');
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(0);
  const navigate = useNavigate();
  const gameName = prop.gameName;
  const gameId = prop.gameId;
  const img = prop.img;
  const index = prop.index;
  const questionsCount = prop.questionCount;
  const sumTime = prop.sumTime;

  console.log(sessionId)

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  React.useEffect(async () => {
    const res = await apiCall(`admin/quiz/${gameId}`, 'GET', headers, {})
    setSessionId(res.active === null ? 0 : res.active);
  }, [startOpen])

  const handleStartClose = () => {
    setStartOpen(false);
  }

  const handleEndClose = () => {
    setEndOpen(false);
  }
  // const toggleGameState = async () => {
  //   if (status === 'start') {
  //     setStatus('stop');
  //     setStartOpen(true);
  //     await apiCall(`admin/quiz/${gameId}/start`, 'POST', headers, {}).then();
  //     const res = await apiCall(`admin/quiz/${gameId}`, 'GET', headers, {})
  //     setSessionId(res.active);
  //   } else {
  //   }
  // }

  return (
    <div style={{ border: 'solid 1px', margin: '5px', padding: '10px 40px' }}>
    <p>Name : {gameName}</p>
    <p>Quiz Index: {index}</p>
    <p>Number of questions: {questionsCount}</p>
    <p>Total time to complete: {sumTime} seconds</p>
    <p>Img: {img}</p>
    <Stack direction="row" spacing={2}>
      <Button variant="contained" component="span" onClick={() => navigate(`/quiz/edit/${gameId}`)}>
        update
      </Button>
      <Button variant="outlined" startIcon={<DeleteIcon />} onClick={prop.delete}>
        Delete
      </Button>
    </Stack>
      <br/>
    <Stack direction="row" spacing={2}>
      {
        sessionId === 0
          ? <Button variant="contained" color="secondary" onClick={async () => {
            setStartOpen(true);
            await apiCall(`admin/quiz/${gameId}/start`, 'POST', headers, {});
          }}>Start</Button>
          : <Button variant={'outlined'} color={'warning'} onClick={async () => {
            setSessionId(0);
            setEndOpen(true);
            await apiCall(`admin/quiz/${gameId}/end`, 'POST', headers, {});
          }}>Stop</Button>
      }
    </Stack>
    <Popup open={startOpen} onclose={handleStartClose} use={'start'} quizId={gameId} sessionId={sessionId}>start</Popup>
    <Popup open={endOpen} onclose={handleEndClose} use={'end'} quizId={gameId} sessionId={sessionId}>end</Popup>
    </div>
  )
}

export default QuizCard;
