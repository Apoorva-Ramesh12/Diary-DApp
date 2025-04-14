import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import DiaryABI from './DiaryABI.json';
const contractAddress = "0x03B30eF3226960b7De06A00B0eb2c23f42928AFE"; // Replace this

const contractABI = DiaryABI;

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [newEntry, setNewEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchEntries();
      subscribeToEvents();
    }
  }, [contract, account]);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const diaryContract = new Contract(contractAddress, contractABI, signer);
        setAccount(accounts[0]);
        setContract(diaryContract);
        setIsConnected(true);
        console.log("connectWallet: Wallet connected. Account:", accounts[0], "Contract:", diaryContract.address);
      } catch (error) {
        console.error("connectWallet: Could not connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function addDiaryEntry() {
    if (contract && newEntry) {
      try {
        console.log("addDiaryEntry: Attempting to add entry:", newEntry);
        const tx = await contract.addEntry(newEntry);
        console.log("addDiaryEntry: Transaction sent:", tx.hash);
        await tx.wait();
        console.log("addDiaryEntry: Transaction confirmed.");
        setNewEntry('');
        // The event listener should handle updating the entries
      } catch (error) {
        console.error("addDiaryEntry: Error adding entry:", error);
      }
    } else {
      alert("Please connect wallet and enter your diary entry.");
    }
  }

  async function fetchEntries() {
    if (contract && account) {
      try {
        console.log("fetchEntries: Fetching your entries...");
        const userEntries = await contract.getMyEntries(); // Call getMyEntries
        console.log("fetchEntries: Raw entries from contract:", userEntries);
        const formatted = userEntries.map(entry => ({
          timestamp: new Date(Number(entry.timestamp) * 1000).toLocaleString(),
          content: entry.content,
        }));
        console.log("fetchEntries: Formatted entries:", formatted);
        setEntries(formatted);
      } catch (error) {
        console.error("fetchEntries: Error fetching entries:", error);
      }
    }
  }

  function subscribeToEvents() {
    if (contract) {
      console.log("subscribeToEvents: Subscribing to EntryAdded event.");
      contract.on("EntryAdded", (user, timestamp, content) => {
        console.log("subscribeToEvents: Event Received - User:", user, "Timestamp:", timestamp, "Content:", content);
        if (user?.toLowerCase() === account?.toLowerCase()) {
          const newEntryObject = {
            timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
            content: content,
          };
          console.log("subscribeToEvents: New entry for current account:", newEntryObject);
          setEntries(prevEntries => [...prevEntries, newEntryObject]);
          console.log("subscribeToEvents: Entries state updated:", entries);
        }
      });
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Decentralized Diary</h1>

      {!isConnected ? (
        <button onClick={connectWallet} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><strong>Your Account:</strong> {account}</p>

          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#fff' }}>
            <h3>New Entry</h3>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ddd', minHeight: '100px', marginBottom: '10px' }}
            />
            <button onClick={addDiaryEntry} style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Add Entry
            </button>
          </div>

          <div>
            <h3>Your Diary Entries</h3>
            {entries.length === 0 ? (
              <p>No entries yet.</p>
            ) : (
              <ul>
                {entries.map((entry, index) => (
                  <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff' }}>
                    <p><strong>Timestamp:</strong> {entry.timestamp}</p>
                    <p><strong>Content:</strong> {entry.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;