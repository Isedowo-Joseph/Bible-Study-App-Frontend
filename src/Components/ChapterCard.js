import React, { useState, useEffect } from "react";
import BibleAPIService from "../Services/BibleAPIService";
import { useTimer } from 'react-timer-hook';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import BibleStudyService from "../Services/BibleStudyService";

const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", 
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", 
  "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", 
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", 
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament Books
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


const ChapterCard = ({bibleId}) => {
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [version, setversion] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [duration, setduration] = useState(null);
  const [studyData, setstudyData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleVersesCount, setVisibleVersesCount] = useState(10); // Limit to 10 verses initially
  const [studyEnded, setStudyEnded] = useState(false); // To handle end of session
  const [studyBegin, setStudyBegin] = useState(false); // To handle the start of the study
  const [ExpiryTime, setExpiryTime] = useState(null);
  // State to track chapters completed in the current session
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
  } = useTimer({ExpiryTime, autoStart: true, onExpire: () => setStudyEnded(true) });

// Fetch study data from the database
useEffect(() => {
  if (bibleId) {
    const fetchData = async () => {
      try {
        // Fetch Bible study session data
        const sessionResponse = await BibleStudyService.getSessionById(bibleId);
        const { bible, duration } = sessionResponse.data;
        
        // Ensure the Bible object contains current state info
        
        setBook(bible.book); // Fetch the current book from session
        setChapter(bible.currentChapter); // Fetch the current chapter from session
        setversion(bible.bibleVersion);
        setduration(duration * 60); // Fetch and convert duration
        

        console.log('Fetched Bible Study Session:', sessionResponse.data);
      } catch (error) {
        console.error('Error fetching study data:', error);
        setError("Failed to fetch study session data.");
      }
    };

    fetchData();
  }
}, [studyBegin]);

  useEffect(() => {
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP Debug:', str),
        reconnectDelay: 5000, // Reconnect every 5 seconds
      });

      stompClient.onConnect = (frame) => {
        console.log('Connected:', frame);
        stompClient.subscribe(`/topic/bibleStudyUpdates/${bibleId}`, (message) => {
          const updatedStudyData = JSON.parse(message.body);
          setChapterData(updatedStudyData.bible);
          setBook(updatedStudyData.bible.book); // Fetch the current book from session
          setChapter(updatedStudyData.bible.currentChapter); // Fetch the current chapter from session
          setversion(updatedStudyData.bible.bibleVersion);
          setduration(updatedStudyData.duration * 60);
        });
        stompClient.subscribe(`/topic/timer/${bibleId}`, (message) => {
          const newExpiryTime = new Date(JSON.parse(message.body));
          setExpiryTime(newExpiryTime);
        });
      };

      stompClient.onStompError = (error) => {
        console.error('STOMP Error:', error);
      };

      stompClient.activate();
    
  }, [bibleId]);
  useEffect(() => {
    if (studyBegin) {
      setLoading(true);
      BibleAPIService.getChapter(book, chapter, version)
        .then((response) => {
          const passageData = response.data.cleanedPassage;
          handleUpdate(bibleId, passageData, chapter, book, version);
          setLoading(false);
          BibleStudyService.startTimer(bibleId,duration);
        })
        .catch((err) => {
          setError("Failed to fetch chapter data");
          setLoading(false);
        });
    }
  }, [studyBegin]);
  const handleChapterupdate = (bibleStudyId,chapter, book, version) => {
    setLoading(true);
    BibleAPIService.getChapter(book, chapter, version)
      .then((response) => {
        const passageData = response.data.cleanedPassage;
        handleUpdate(bibleStudyId, passageData, chapter, book,version);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch chapter data");
        setLoading(false);
      });
};
  // Function to load more verses
  const loadMoreVerses = () => {
    setVisibleVersesCount((prevCount) => prevCount + 10); // Increase the count by 10
  };

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
      handleChapterupdate(bibleId, chapter + 1, book, version);
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
            handleChapterupdate(bibleId, previousChapter, book, version);
            setVisibleVersesCount(10);
        }
        else{
            setChapter(previousChapter);
            handleChapterupdate(bibleId, previousChapter, book, version);
            setVisibleVersesCount(10);
        }
    }
    else{
        handleChapterupdate(bibleId, chapter, book, version);
    }
  };
  
// Function to go to the next book after the last chapter
const goToNextBook = () => {
  const currentBookIndex = bibleBooks.indexOf(book);

  if (currentBookIndex < bibleBooks.length - 1) {
    setBook(bibleBooks[currentBookIndex + 1]);
    setChapter(1); // Start at chapter 1 of the next book
    setChaptersCompleted((prevCount) => prevCount + 1); // Increment completed chapters count
    setVisibleVersesCount(10); // Reset verse count
    setStudyEnded(false); // Reset study end status

    handleChapterupdate(bibleId, 1, bibleBooks[currentBookIndex + 1], version);
  } else {
    // No more books left, end the study session
    setStudyEnded(true);
    handleChapterupdate(bibleId, 1, book, version, true);
  }
};
  const handleUpdate = async (bibleId, chapterData, chapter, book, version) => {
    const results = {
      bible: {
        currentChapter: chapter,
        book: book,
        passage: chapterData,
        bibleVersion: version
      },
    };
    try {
      // Make the API call using await
      const response = await BibleStudyService.updateSession(bibleId,results)
      console.log(response);
    } catch (error) {
      // Handle errors from the API request
      console.error('Error updating bible session:', error);
    }
  };
  
  // Function to start the Bible study session
  const startBibleStudy = () => {
    setStudyBegin(true); // Set to true to indicate the session has started
  };
 // Restart the timer when the expiry time updates
 useEffect(() => {
  if (ExpiryTime) {
    restart(ExpiryTime); // Restart the timer with the new expiry time
  }
}, [ExpiryTime, restart]);
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
                BibleStudyService.startTimer(bibleId, duration);
            }} style={styles.button}>
            Start Next Chapter
            </button>
        </div>
      </div>
    );
  }

  if (!studyBegin) {
    return (    
    <div style = {{display:"flex", width:"100%", height:"80vh"}}>
      <div style={styles.cardCenter}>
        <h2>Start Bible Study Session</h2>
        <button onClick={startBibleStudy} style={styles.button}>
          Start Study
        </button>   
      </div>
      </div>
    );
  }

  // Check if chapterData and cleanedPassage exist before rendering verses
  if (!chapterData) {
    return <div>No data available for this chapter.</div>;
  }

  // Split the cleaned passage into verses (assuming verses are separated by new lines)
  const verses = chapterData.passage.split(/(?=\(\d+\))/).filter(Boolean);

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
          {chapterData? (<h2>{chapterData.book} Chapter {chapterData.currentChapter} ({chapterData.bibleVersion})</h2>):(<h2>{book} Chapter {chapter} ({version})</h2>)}
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
    display: 'flex',          // Align elements side by side
    justifyContent: 'center', // Center the items horizontally
    alignItems: 'center',     // Center the items vertically
    gap: '40px',              // Add space between the countdown and the card
    padding: '16px',          // Add some padding to the container
    },
    countdown: {
    textAlign: 'center',      // Center the text inside the countdown block
    marginLeft: '125px', 
    },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginLeft: "auto", // Push the card to the right
    width: "50%", // Set a fixed width for the card
  },
  cardCenter: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "auto",
    width: "50%", // Set a fixed width for the card 
  },
  content: {
    marginTop: "12px",
    maxHeight: "450px", // Set a fixed height for the content area
    overflowY: "auto", // Enable vertical scrolling
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

export default ChapterCard;
