import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import BibleAPIService from "../Services/BibleAPIService";
import { useTimer } from 'react-timer-hook';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import BibleStudyService from "../Services/BibleStudyService";

// List of Bible books in order
const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", 
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", 
  "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", 
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", 
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", 
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", 
  "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", 
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", 
  "3 John", "Jude", "Revelation"
];  
// List of Bible books in order
const bibleChapters = {
  "Genesis": 50,
  "Exodus": 40,
  "Leviticus": 27,
  "Numbers": 36,
  "Deuteronomy": 34,
  "Joshua": 24,
  "Judges": 21,
  "Ruth": 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Kings": 22,
  "2 Kings": 25,
  "1 Chronicles": 29,
  "2 Chronicles": 36,
  "Ezra": 10,
  "Nehemiah": 13,
  "Esther": 10,
  "Job": 42,
  "Psalms": 150,
  "Proverbs": 31,
  "Ecclesiastes": 12,
  "Song of Solomon": 8,
  "Isaiah": 66,
  "Jeremiah": 52,
  "Lamentations": 5,
  "Ezekiel": 48,
  "Daniel": 12,
  "Hosea": 14,
  "Joel": 3,
  "Amos": 9,
  "Obadiah": 1,
  "Jonah": 4,
  "Micah": 7,
  "Nahum": 3,
  "Habakkuk": 3,
  "Zephaniah": 3,
  "Haggai": 2,
  "Zechariah": 14,
  "Malachi": 4,
  // New Testament Books
  "Matthew": 28,
  "Mark": 16,
  "Luke": 24,
  "John": 21,
  "Acts": 28,
  "Romans": 16,
  "1 Corinthians": 16,
  "2 Corinthians": 13,
  "Galatians": 6,
  "Ephesians": 6,
  "Philippians": 4,
  "Colossians": 4,
  "1 Thessalonians": 5,
  "2 Thessalonians": 3,
  "1 Timothy": 6,
  "2 Timothy": 4,
  "Titus": 3,
  "Philemon": 1,
  "Hebrews": 13,
  "James": 5,
  "1 Peter": 5,
  "2 Peter": 3,
  "1 John": 5,
  "2 John": 1,
  "3 John": 1,
  "Jude": 1,
  "Revelation": 22
};

console.log(bibleChapters["Genesis"]);  // Outputs: 50
const ChapterCardView = () => {
const [studyBegin, setStudyBegin] = useState(false); // To handle the start of the study
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [version, setVersion] = useState(null);
  const [StudyData, setStudyData] = useState(null);  // Proper hook setup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleVersesCount, setVisibleVersesCount] = useState(10);
  const [studyEnded, setStudyEnded] = useState(false);
  const [ExpiryTime, setExpiryTime] = useState(null);
  const {bibleStudyId} = useParams();
  const [chaptersCompleted, setChaptersCompleted] = useState(1);
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ ExpiryTime, autoStart: true, onExpire: () => setStudyEnded(true) });

  // Socket setup for real-time Bible study updates
  useEffect(() => {
    console.log(bibleStudyId);
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP Debug:', str),
        reconnectDelay: 5000, 
      });

      stompClient.onConnect = (frame) => {
        console.log('Connected:', frame);
        stompClient.subscribe(`/topic/bibleStudyUpdates/${bibleStudyId}`, (message) => {
            const updatedStudyData = JSON.parse(message.body);
            console.log('Received Bible study update:', updatedStudyData);
            setStudyData(updatedStudyData.bible);  // Update study data
            setBook(updatedStudyData.bible.book);
            console.log(updatedStudyData.bible.currentChapter)
            setChapter(updatedStudyData.bible.currentChapter);
            setVersion(updatedStudyData.bible.bibleVersion);
          });
        stompClient.subscribe(`/topic/timer/${bibleStudyId}`, (message) => {
          const newExpiryTime = new Date(JSON.parse(message.body));
          setExpiryTime(newExpiryTime);  // Update timer
        });
      };

      stompClient.onStompError = (error) => {
        console.error('STOMP Error:', error);
      };

      stompClient.activate();
    
  },[]);

  const handleChapterupdate = (bibleStudyId,chapter, book, version) => {
      setLoading(true);
      BibleAPIService.getChapter(book, chapter, version)
        .then((response) => {
          const passageData = response.data.cleanedPassage;
          handleUpdate(bibleStudyId, chapter, book,version, passageData);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch chapter data");
          setLoading(false);
        });
  };

  // Function to load more verses
  const loadMoreVerses = () => {
    setVisibleVersesCount((prevCount) => prevCount + 10);
  };

  // Navigation functions (Next)
// Function to go to the next chapter
const goToNextChapter = () => {
  const totalChaptersInBook = bibleChapters[book]; // Get total chapters for the current book

  if (chaptersCompleted <= 4) {
    // Check if there are more chapters in the current book
    if (chapter < totalChaptersInBook) {
      // Increment chapter and completed chapters count
      setChapter((prevChapter) => prevChapter + 1);
      setChaptersCompleted((prevCount) => prevCount + 1);
      setVisibleVersesCount(10); // Reset verse count for new chapter

      // Update chapter in the Bible study session
      handleChapterupdate(bibleStudyId, chapter + 1, book, version);
    } else {
      // If this is the last chapter of the current book, move to the next book
      goToNextBook();
    }
  } else {
    // End the study session after completing 5 chapters
    setStudyEnded(true);
    setChaptersCompleted(1)
  }
};

  const goToPreviousChapter = () => {
    if( chapter > 1){
        const previousChapter = chapter - 1;
        if(chapter == 2){
            setChapter(previousChapter);
            handleChapterupdate(bibleStudyId,previousChapter, book, version);
            setVisibleVersesCount(10);
        }
        else{
            setChapter(previousChapter);
            handleChapterupdate(bibleStudyId,previousChapter, book, version);
            setVisibleVersesCount(10);
        }
    }
    else{
        handleChapterupdate(bibleStudyId,chapter, book, version);
    }
  };

  const goToNextBook = () => {
    const currentBookIndex = bibleBooks.indexOf(book);
    if (currentBookIndex < bibleBooks.length - 1) {
      setBook(bibleBooks[currentBookIndex + 1]);
      setChapter(1);
      setVisibleVersesCount(10);
      setStudyEnded(false);
      handleChapterupdate(bibleStudyId, 1, bibleBooks[currentBookIndex + 1], version);
    } else {
      setStudyEnded(true);
      handleChapterupdate(bibleStudyId, 1, book, version, true);
    }
  };

  // API call to handle study data update
  const handleUpdate = async (bibleStudyId, chapter, book, version, chapterData) => {
    try {
      const response = await BibleStudyService.updateSession(bibleStudyId, {
        bible: {
          currentChapter: chapter, 
          book: book,
          passage: chapterData, // The data you're sending to update
          bibleVersion: version,
        },
      });
  
      if (response.data && response.data.bible) {
        setStudyData(response.data.bible);  // Update StudyData with passage
      }
    } catch (error) {
      console.error('Error updating bible session:', error);
    }
  };

  // Restart the timer when ExpiryTime updates
  useEffect(() => {
    if (ExpiryTime) {
      restart(ExpiryTime);  // Restart timer
    }
  }, [ExpiryTime, restart]);

  // Conditional rendering based on study state
  if (loading) return <div style={styles.card} hidden={true}>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (studyEnded) {
    return (
      <div style={{display:"flex", width:"100%", height:"80vh"}}>        
        <div style={styles.cardCenter}>
            <h2>End of Bible Study Session</h2>
            <button onClick={() => {
              setStudyEnded(false);
                goToNextChapter();
            }} style={styles.button}>
            Start Next Chapter
            </button>
        </div>
      </div>
    );
  }
  
  if (!StudyData) {
    return <div>Bible Study will begin shortly...</div>;
  }

  const verses = StudyData.passage.split(/(?=\(\d+\))/).filter(Boolean);

  return (
    <div style={styles.container}>
        <div style={styles.countdown}>
        <h1> Session Countdown</h1>
        <div style={{fontSize: '100px'}}>
            <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <p>{isRunning ? 'Running' : 'Not running'}</p>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
        </div>
        
        <div style={styles.card}>
        <h2>{StudyData.book} Chapter {StudyData.currentChapter} ({StudyData.bibleVersion})</h2>
        <div style={styles.content}>
        {verses.slice(0, visibleVersesCount).map((verse, index) => (
            <p key={index}>{verse}</p>
            ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={goToPreviousChapter} style={styles.button}>
                Go to Previous Chapter
            </button>
            
            {visibleVersesCount < verses.length && (
                <button onClick={loadMoreVerses} style={styles.button}>
                Load More Verses
                </button>
            )}
            
            <button onClick={goToNextChapter} style={styles.button}>
                Go to Next Chapter
            </button>
            </div>
        </div>
    </div>
  );
};

// Example CSS styles for the card
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    padding: '16px',
  },
  countdown: {
    textAlign: 'center',
    marginLeft: '125px', 
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginLeft: "auto",
    width: "50%",
  },
  cardCenter: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "auto",
    width: "50%",
  },
  content: {
    marginTop: "12px",
    maxHeight: "450px",
    overflowY: "auto",
  },
  button: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ChapterCardView;
