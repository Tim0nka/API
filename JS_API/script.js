// Базовый класс для музыкального трека
class Track {
    constructor(id, title, artist, cover, audio, duration, lyrics) {
        this._id = id;
        this._title = title;
        this._artist = artist;
        this._cover = cover;
        this._audio = audio;
        this._duration = duration;
        this._lyrics = lyrics;
    }

    // Геттеры для инкапсуляции
    get id() { return this._id; }
    get title() { return this._title; }
    get artist() { return this._artist; }
    get cover() { return this._cover; }
    get audio() { return this._audio; }
    get duration() { return this._duration; }
    get lyrics() { return this._lyrics; }

    // Полиморфизм: метод для отображения информации
    displayInfo() {
        return `${this.title} - ${this.artist}`;
    }

    // Полиморфизм: метод для создания DOM элемента
    createTrackElement(index, isActive = false) {
        const trackElement = document.createElement('div');
        trackElement.className = `track-card ${isActive ? 'active' : ''}`;
        
        trackElement.innerHTML = `
            <img src="${this.cover}" alt="${this.title}" class="track-cover">
            <div class="track-info">
                <div class="track-title">${this.title}</div>
                <div class="track-artist">${this.artist}</div>
            </div>
            <div class="track-duration">${this.duration}</div>
        `;
        
        return trackElement;
    }
}

// Класс для управления плейлистом
class Playlist {
    constructor() {
        this._tracks = [];
        this._originalOrder = [];
    }

    get tracks() { return this._tracks; }
    get originalOrder() { return this._originalOrder; }

    addTrack(track) {
        this._tracks.push(track);
        this._originalOrder.push(track);
    }

    clear() {
        this._tracks = [];
        this._originalOrder = [];
    }

    shuffle() {
        if (this._tracks.length <= 1) return;
        
        // Создаем копию массива и перемешиваем все треки
        const shuffled = [...this._tracks];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        this._tracks = shuffled;
    }

    restoreOriginalOrder() {
        this._tracks = [...this._originalOrder];
    }

    findTrackIndexById(trackId) {
        return this._tracks.findIndex(track => track.id === trackId);
    }

    getTrack(index) {
        return this._tracks[index];
    }

    get length() {
        return this._tracks.length;
    }
}

// Абстрактный класс для проигрывателя
class MediaPlayer {
    constructor() {
        if (this.constructor === MediaPlayer) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    // Абстрактные методы (полиморфизм)
    play() {
        throw new Error("Method 'play()' must be implemented");
    }

    pause() {
        throw new Error("Method 'pause()' must be implemented");
    }

    stop() {
        throw new Error("Method 'stop()' must be implemented");
    }

    setVolume(volume) {
        throw new Error("Method 'setVolume()' must be implemented");
    }
}

// Конкретная реализация аудио проигрывателя
class AudioPlayer extends MediaPlayer {
    constructor() {
        super();
        this._audioElement = document.getElementById('audioPlayer');
        this._isPlaying = false;
        this._volume = 0.7;
        this._currentTime = 0;
        this._progressInterval = null;
    }

    play() {
        this._isPlaying = true;
        console.log("Audio playback started");
    }

    pause() {
        this._isPlaying = false;
        console.log("Audio playback paused");
        this.stopProgress();
    }

    stop() {
        this._isPlaying = false;
        this._currentTime = 0;
        console.log("Audio playback stopped");
        this.stopProgress();
    }

    setVolume(volume) {
        this._volume = Math.max(0, Math.min(1, volume));
        console.log(`Volume set to: ${this._volume}`);
    }

    startProgress(callback, duration = 30) {
        this.stopProgress();
        let progress = 0;
        
        this._progressInterval = setInterval(() => {
            if (!this._isPlaying) {
                this.stopProgress();
                return;
            }
            
            progress += 1;
            const progressPercent = (progress / duration) * 100;
            callback(progressPercent, progress, duration);
            
            if (progress >= duration) {
                this.stopProgress();
                if (typeof this.onTrackEnd === 'function') {
                    this.onTrackEnd();
                }
            }
        }, 1000);
    }

    stopProgress() {
        if (this._progressInterval) {
            clearInterval(this._progressInterval);
            this._progressInterval = null;
        }
    }

    setProgress(percent, duration = 30) {
        const progress = (percent / 100) * duration;
        return progress;
    }

    get isPlaying() { return this._isPlaying; }
    get volume() { return this._volume; }
    get currentTime() { return this._currentTime; }
    set currentTime(time) { this._currentTime = time; }
}

// Класс для управления интерфейсом
class PlayerUI {
    constructor() {
        this.initElements();
    }

    initElements() {
        this.tracksContainer = document.getElementById('tracksContainer');
        this.tracksList = document.getElementById('tracksList');
        this.player = document.getElementById('player');
        this.playerCover = document.getElementById('playerCover');
        this.playerTitle = document.getElementById('playerTitle');
        this.playerArtist = document.getElementById('playerArtist');
        this.progressBar = document.getElementById('progressBar');
        this.progressContainer = document.getElementById('progressContainer');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.lyricsBtn = document.getElementById('lyricsBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.lyricsContainer = document.getElementById('lyricsContainer');
        this.lyricsContent = document.getElementById('lyricsContent');
        this.backBtn = document.getElementById('backBtn');
        this.volumeIcon = document.getElementById('volumeIcon');
    }

    renderTracksList(playlist, currentTrackIndex, onTrackClick) {
        this.tracksContainer.innerHTML = '';
        
        playlist.tracks.forEach((track, index) => {
            const trackElement = track.createTrackElement(index, index === currentTrackIndex);
            trackElement.addEventListener('click', () => onTrackClick(index));
            this.tracksContainer.appendChild(trackElement);
        });
    }

    updatePlayerInfo(track) {
        this.playerCover.src = track.cover;
        this.playerTitle.textContent = track.title;
        this.playerArtist.textContent = track.artist;
        this.durationEl.textContent = track.duration;
    }

    updateProgress(progress, currentTime, duration) {
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
        this.durationEl.textContent = this.formatTime(duration);
    }

    togglePlayPause(isPlaying) {
        this.playBtn.style.display = isPlaying ? 'none' : 'flex';
        this.pauseBtn.style.display = isPlaying ? 'flex' : 'none';
    }

    toggleShuffle(isShuffled) {
        this.shuffleBtn.classList.toggle('active', isShuffled);
    }

    toggleRepeat(isRepeating) {
        this.repeatBtn.classList.toggle('active', isRepeating);
    }

    showPlayer() {
        this.tracksList.style.display = 'none';
        this.player.classList.add('active');
    }

    showTracksList() {
        this.player.classList.remove('active');
        this.tracksList.style.display = 'block';
        this.hideLyrics();
    }

    toggleLyrics(lyrics) {
        const isVisible = this.lyricsContainer.classList.contains('active');
        
        if (!isVisible) {
            this.lyricsContent.textContent = lyrics;
            this.lyricsContainer.classList.add('active');
            this.lyricsBtn.innerHTML = `
                <svg class="action-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Скрыть текст
            `;
        } else {
            this.hideLyrics();
        }
    }

    hideLyrics() {
        this.lyricsContainer.classList.remove('active');
        this.lyricsBtn.innerHTML = `
            <svg class="action-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            Текст песни
        `;
    }

    updateVolumeIcon(volume) {
        if (volume === 0) {
            this.volumeIcon.innerHTML = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
        } else if (volume < 0.5) {
            this.volumeIcon.innerHTML = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
        } else {
            this.volumeIcon.innerHTML = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
        }
    }

    updateActiveTrack(currentTrackIndex) {
        const trackItems = document.querySelectorAll('.track-card');
        trackItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentTrackIndex);
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// Главный класс приложения (композиция)
class MusicPlayerApp {
    constructor() {
        this.playlist = new Playlist();
        this.audioPlayer = new AudioPlayer();
        this.ui = new PlayerUI();
        
        this.currentTrackIndex = 0;
        this.isShuffled = false;
        this.isRepeating = false;
        this.isUserInteraction = false;

        this.initializeTracks();
        this.setupEventListeners();
        this.ui.renderTracksList(this.playlist, this.currentTrackIndex, (index) => this.loadTrack(index));
        
        // Назначаем обработчик окончания трека
        this.audioPlayer.onTrackEnd = () => this.handleTrackEnd();
    }

    initializeTracks() {
        const tracksData = [
            {
                id: 1,
                title: "Bohemian Rhapsody",
                artist: "Queen",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                audio: "demo1.mp3",
                duration: "5:55",
                lyrics: "Is this the real life? Is this just fantasy?\nCaught in a landslide, no escape from reality\n\nOpen your eyes, look up to the skies and see...\nI'm just a poor boy, I need no sympathy\nBecause I'm easy come, easy go\nLittle high, little low\n\nAnyway the wind blows, doesn't really matter to me, to me..."
            },
            {
                id: 2,
                title: "Shape of You",
                artist: "Ed Sheeran",
                cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
                audio: "demo2.mp3",
                duration: "3:53",
                lyrics: "The club isn't the best place to find a lover\nSo the bar is where I go\nMe and my friends at the table doing shots\nDrinking fast and then we talk slow\n\nAnd you come over and start up a conversation with just me\nAnd trust me I'll give it a chance now\nTake my hand, stop, put Van the Man on the jukebox\nAnd then we start to dance, and now I'm singing like..."
            },
            {
                id: 3,
                title: "Blinding Lights",
                artist: "The Weeknd",
                cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400",
                audio: "demo3.mp3",
                duration: "3:20",
                lyrics: "I been tryna call\nI been on my own for long enough\nMaybe you can show me how to love, maybe\n\nI'm going through withdrawals\nYou don't even have to do too much\nYou can turn me on with just a touch, baby\n\nI look around and Sin City's cold and empty\nNo one's around to judge me\nI can't see clearly when you're gone..."
            },
            {
                id: 4,
                title: "Dance Monkey",
                artist: "Tones and I",
                cover: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400",
                audio: "demo4.mp3",
                duration: "3:29",
                lyrics: "They say, oh my god I see the way you shine\nTake your hand, my dear, and place them both in mine\nYou know you stopped me dead while I was passing by\nAnd now I beg to see you dance just one more time\n\nOoh I see you, see you, see you every time\nAnd oh my I, I, I like your style\nYou, you make me, make me, make me wanna cry\nAnd now I beg to see you dance just one more time..."
            },
            {
                id: 5,
                title: "Bad Guy",
                artist: "Billie Eilish",
                cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400",
                audio: "demo5.mp3",
                duration: "3:14",
                lyrics: "White shirt now red, my bloody nose\nSleeping, you're on your tippy toes\nCreeping around like no one knows\nThink you're so criminal\n\nBruises on both my knees for you\nDon't say thank you or please\nI do what I want when I'm wanting to\nMy soul? So cynical\n\nSo you're a tough guy\nLike it really rough guy\nJust can't get enough guy\nChest always so puffed guy\nI'm that bad type\nMake your mama sad type\nMake your girlfriend mad tight\nMight seduce your dad type..."
            }
        ];

        tracksData.forEach(trackData => {
            const track = new Track(
                trackData.id,
                trackData.title,
                trackData.artist,
                trackData.cover,
                trackData.audio,
                trackData.duration,
                trackData.lyrics
            );
            this.playlist.addTrack(track);
        });
    }

    setupEventListeners() {
        this.ui.playBtn.addEventListener('click', () => this.playTrack());
        this.ui.pauseBtn.addEventListener('click', () => this.pauseTrack());
        this.ui.prevBtn.addEventListener('click', () => this.previousTrack());
        this.ui.nextBtn.addEventListener('click', () => this.nextTrack());
        this.ui.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.ui.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.ui.volumeSlider.addEventListener('input', () => this.setVolume());
        this.ui.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        this.ui.lyricsBtn.addEventListener('click', () => this.toggleLyrics());
        this.ui.downloadBtn.addEventListener('click', () => this.downloadTrack());
        this.ui.backBtn.addEventListener('click', () => this.ui.showTracksList());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        if (!this.isUserInteraction) {
            this.isUserInteraction = true;
        }

        this.currentTrackIndex = index;
        const track = this.playlist.getTrack(this.currentTrackIndex);
        
        this.ui.updatePlayerInfo(track);
        this.ui.updateProgress(0, 0, 30);
        this.ui.hideLyrics();
        this.ui.togglePlayPause(false);
        this.ui.updateActiveTrack(this.currentTrackIndex);
        this.ui.showPlayer();
        
        // Останавливаем текущее воспроизведение при загрузке нового трека
        this.audioPlayer.stop();
    }

    playTrack() {
        if (!this.isUserInteraction) this.isUserInteraction = true;
        
        this.audioPlayer.play();
        this.ui.togglePlayPause(true);
        
        // Запускаем симуляцию прогресса
        this.audioPlayer.startProgress((progress, currentTime, duration) => {
            this.ui.updateProgress(progress, currentTime, duration);
        }, 30);
    }

    pauseTrack() {
        this.audioPlayer.pause();
        this.ui.togglePlayPause(false);
    }

    nextTrack() {
        if (!this.isUserInteraction) this.isUserInteraction = true;
        
        let nextIndex = this.currentTrackIndex + 1;
        if (nextIndex >= this.playlist.length) nextIndex = 0;
        this.loadTrack(nextIndex);
        
        // Автоматически запускаем воспроизведение следующего трека
        setTimeout(() => this.playTrack(), 500);
    }

    previousTrack() {
        if (!this.isUserInteraction) this.isUserInteraction = true;
        
        let prevIndex = this.currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = this.playlist.length - 1;
        this.loadTrack(prevIndex);
        
        // Автоматически запускаем воспроизведение предыдущего трека
        setTimeout(() => this.playTrack(), 500);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        
        if (this.isShuffled) {
            // Сохраняем ID текущего трека перед перемешиванием
            const currentTrackId = this.playlist.getTrack(this.currentTrackIndex).id;
            this.playlist.shuffle();
            // Находим новый индекс текущего трека после перемешивания
            this.currentTrackIndex = this.playlist.findTrackIndexById(currentTrackId);
        } else {
            // Сохраняем ID текущего трека перед восстановлением порядка
            const currentTrackId = this.playlist.getTrack(this.currentTrackIndex).id;
            this.playlist.restoreOriginalOrder();
            // Находим новый индекс текущего трека после восстановления порядка
            this.currentTrackIndex = this.playlist.findTrackIndexById(currentTrackId);
        }
        
        this.ui.toggleShuffle(this.isShuffled);
        this.ui.renderTracksList(this.playlist, this.currentTrackIndex, (index) => this.loadTrack(index));
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        this.ui.toggleRepeat(this.isRepeating);
    }

    toggleLyrics() {
        const track = this.playlist.getTrack(this.currentTrackIndex);
        this.ui.toggleLyrics(track.lyrics);
    }

    setVolume() {
        const volume = this.ui.volumeSlider.value / 100;
        this.audioPlayer.setVolume(volume);
        this.ui.updateVolumeIcon(volume);
    }

    setProgress(e) {
        if (!this.isUserInteraction) this.isUserInteraction = true;
        
        const width = this.ui.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const progressPercent = (clickX / width) * 100;
        
        const totalSeconds = 30;
        const currentSeconds = this.audioPlayer.setProgress(progressPercent, totalSeconds);
        
        this.ui.updateProgress(progressPercent, currentSeconds, totalSeconds);
    }

    downloadTrack() {
        const track = this.playlist.getTrack(this.currentTrackIndex);
        alert(`В демо-режиме скачивание недоступно.\nТрек: ${track.title} - ${track.artist}`);
    }

    handleTrackEnd() {
        if (this.isRepeating) {
            this.loadTrack(this.currentTrackIndex);
            setTimeout(() => this.playTrack(), 500);
        } else {
            this.nextTrack();
        }
    }

    handleKeyPress(e) {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (!this.isUserInteraction) this.isUserInteraction = true;
            if (this.audioPlayer.isPlaying) {
                this.pauseTrack();
            } else {
                this.playTrack();
            }
        }
        else if (e.code === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            if (!this.isUserInteraction) this.isUserInteraction = true;
            this.nextTrack();
        }
        else if (e.code === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            if (!this.isUserInteraction) this.isUserInteraction = true;
            this.previousTrack();
        }
        else if (e.code === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            this.ui.volumeSlider.value = Math.min(100, parseInt(this.ui.volumeSlider.value) + 10);
            this.setVolume();
        }
        else if (e.code === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            this.ui.volumeSlider.value = Math.max(0, parseInt(this.ui.volumeSlider.value) - 10);
            this.setVolume();
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayerApp();
});