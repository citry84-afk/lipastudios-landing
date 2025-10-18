/**
 * LIPA STUDIOS - SISTEMA UNIVERSAL DE COMPARTIR
 * Implementa compartir resultados en redes sociales con recompensas
 * Version: 1.0 - Enero 2025
 */

const LIPAShare = {
    // Configuración
    config: {
        baseURL: 'https://lipastudios.com',
        hashtags: ['LIPAStudios', 'HTML5Games', 'Gaming2025'],
        rewardPoints: 50, // Puntos bonus por compartir
        cooldownMinutes: 30 // Tiempo entre shares para evitar spam
    },

    /**
     * Genera texto de compartir personalizado según el juego
     */
    generateShareText(gameData) {
        const {
            gameName,
            score,
            achievement,
            emoji = '🎮',
            customMessage = ''
        } = gameData;

        let text = `${emoji} ${customMessage || `¡Nuevo récord en ${gameName}!`}\n\n`;
        
        if (score) {
            text += `📊 Puntaje: ${score.toLocaleString()}\n`;
        }
        
        if (achievement) {
            text += `🏆 ${achievement}\n`;
        }
        
        text += `\n🎮 Juega GRATIS: ${this.config.baseURL}\n`;
        text += `#${this.config.hashtags.join(' #')}`;
        
        return text;
    },

    /**
     * Comparte en Twitter/X
     */
    shareTwitter(gameData) {
        const text = this.generateShareText(gameData);
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
        this.trackShare('twitter', gameData.gameName);
        this.giveReward('twitter');
    },

    /**
     * Comparte en Facebook
     */
    shareFacebook(gameData) {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.config.baseURL)}&quote=${encodeURIComponent(this.generateShareText(gameData))}`;
        window.open(url, '_blank', 'width=600,height=400');
        this.trackShare('facebook', gameData.gameName);
        this.giveReward('facebook');
    },

    /**
     * Comparte en WhatsApp
     */
    shareWhatsApp(gameData) {
        const text = this.generateShareText(gameData);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        this.trackShare('whatsapp', gameData.gameName);
        this.giveReward('whatsapp');
    },

    /**
     * Comparte en Telegram
     */
    shareTelegram(gameData) {
        const text = this.generateShareText(gameData);
        const url = `https://t.me/share/url?url=${encodeURIComponent(this.config.baseURL)}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        this.trackShare('telegram', gameData.gameName);
        this.giveReward('telegram');
    },

    /**
     * Copia al portapapeles (universal)
     */
    async copyToClipboard(gameData) {
        const text = this.generateShareText(gameData);
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('✅ ¡Copiado al portapapeles!', 'success');
            this.trackShare('clipboard', gameData.gameName);
            this.giveReward('clipboard');
            return true;
        } catch (err) {
            console.error('Error copiando:', err);
            this.showNotification('❌ Error al copiar', 'error');
            return false;
        }
    },

    /**
     * API Web Share (móvil nativo)
     */
    async shareNative(gameData) {
        if (!navigator.share) {
            this.showNotification('Compartir nativo no disponible', 'info');
            return false;
        }

        try {
            await navigator.share({
                title: `${gameData.gameName} - LIPA Studios`,
                text: this.generateShareText(gameData),
                url: this.config.baseURL
            });
            this.trackShare('native', gameData.gameName);
            this.giveReward('native');
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error compartiendo:', err);
            }
            return false;
        }
    },

    /**
     * Sistema de recompensas
     */
    giveReward(platform) {
        // Verificar cooldown
        const lastShare = localStorage.getItem('lipa_last_share');
        const now = Date.now();
        
        if (lastShare) {
            const elapsed = (now - parseInt(lastShare)) / 1000 / 60;
            if (elapsed < this.config.cooldownMinutes) {
                this.showNotification(`⏱️ Podrás obtener otra recompensa en ${Math.ceil(this.config.cooldownMinutes - elapsed)} minutos`, 'info');
                return;
            }
        }

        // Dar recompensa
        const currentPoints = parseInt(localStorage.getItem('lipa_reward_points') || '0');
        const newPoints = currentPoints + this.config.rewardPoints;
        localStorage.setItem('lipa_reward_points', newPoints.toString());
        localStorage.setItem('lipa_last_share', now.toString());

        // Incrementar contador de shares
        const shareCount = parseInt(localStorage.getItem('lipa_share_count') || '0') + 1;
        localStorage.setItem('lipa_share_count', shareCount.toString());

        this.showNotification(`🎁 ¡+${this.config.rewardPoints} puntos de recompensa!\nTotal: ${newPoints} puntos`, 'reward');

        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share_reward', {
                platform: platform,
                points: this.config.rewardPoints
            });
        }
    },

    /**
     * Obtener puntos acumulados
     */
    getRewardPoints() {
        return parseInt(localStorage.getItem('lipa_reward_points') || '0');
    },

    /**
     * Obtener número de veces compartido
     */
    getShareCount() {
        return parseInt(localStorage.getItem('lipa_share_count') || '0');
    },

    /**
     * Tracking de shares para analytics
     */
    trackShare(platform, gameName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'game_score',
                item_id: gameName
            });
        }
    },

    /**
     * Muestra notificación al usuario
     */
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `lipa-notification lipa-notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline por si no hay CSS cargado
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '20px 30px',
            background: type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : type === 'reward' ? '#ffd700' : '#00ffff',
            color: '#000',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '16px',
            zIndex: '999999',
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease-out',
            whiteSpace: 'pre-line',
            textAlign: 'center'
        });

        document.body.appendChild(notification);

        // Auto-remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Modal de compartir con todas las opciones
     */
    showShareModal(gameData) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'lipa-share-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: '999998',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s'
        });

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'lipa-share-modal';
        Object.assign(modal.style, {
            background: 'linear-gradient(135deg, #0a0a0a, #1a0a2e)',
            border: '3px solid #00ffff',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 0 50px rgba(0, 255, 255, 0.5)',
            animation: 'scaleIn 0.3s'
        });

        const sharePoints = this.getRewardPoints();
        
        modal.innerHTML = `
            <h2 style="color: #00ffff; text-align: center; margin-bottom: 10px; font-size: 28px;">
                🎉 ¡Increíble Resultado!
            </h2>
            <p style="color: #ff00ff; text-align: center; margin-bottom: 20px; font-size: 16px;">
                Comparte tu logro y gana +${this.config.rewardPoints} puntos
            </p>
            
            <div style="background: rgba(0, 255, 255, 0.1); border-radius: 10px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 24px; color: #fff; margin-bottom: 5px;">${gameData.gameName}</div>
                ${gameData.score ? `<div style="font-size: 36px; color: #00ff00; font-weight: bold; margin: 10px 0;">${gameData.score.toLocaleString()}</div>` : ''}
                ${gameData.achievement ? `<div style="color: #ffd700; font-size: 18px;">🏆 ${gameData.achievement}</div>` : ''}
            </div>

            <div style="background: rgba(255, 215, 0, 0.2); border: 2px solid #ffd700; border-radius: 10px; padding: 15px; margin-bottom: 25px; text-align: center;">
                <div style="color: #ffd700; font-weight: bold; margin-bottom: 5px;">💎 Tus Puntos de Recompensa</div>
                <div style="font-size: 32px; color: #ffd700; font-weight: bold;">${sharePoints}</div>
                <div style="color: #aaa; font-size: 14px; margin-top: 5px;">Has compartido ${this.getShareCount()} veces</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <button class="share-btn" data-platform="twitter" style="background: #1DA1F2; color: #fff; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                    🐦 Twitter
                </button>
                <button class="share-btn" data-platform="facebook" style="background: #1877F2; color: #fff; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                    📘 Facebook
                </button>
                <button class="share-btn" data-platform="whatsapp" style="background: #25D366; color: #fff; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                    💬 WhatsApp
                </button>
                <button class="share-btn" data-platform="telegram" style="background: #0088cc; color: #fff; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                    ✈️ Telegram
                </button>
            </div>

            <button class="share-btn" data-platform="copy" style="background: linear-gradient(45deg, #ff00ff, #00ffff); color: #000; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; margin-bottom: 15px; transition: transform 0.2s;">
                📋 Copiar Texto
            </button>

            ${navigator.share ? `
            <button class="share-btn" data-platform="native" style="background: rgba(255, 255, 255, 0.2); color: #fff; border: 2px solid #fff; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; margin-bottom: 15px; transition: transform 0.2s;">
                📱 Compartir (Nativo)
            </button>
            ` : ''}

            <button id="close-share-modal" style="background: rgba(255, 0, 0, 0.2); color: #ff0000; border: 2px solid #ff0000; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; transition: transform 0.2s;">
                ✕ Cerrar
            </button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event listeners
        modal.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                switch(platform) {
                    case 'twitter': this.shareTwitter(gameData); break;
                    case 'facebook': this.shareFacebook(gameData); break;
                    case 'whatsapp': this.shareWhatsApp(gameData); break;
                    case 'telegram': this.shareTelegram(gameData); break;
                    case 'copy': this.copyToClipboard(gameData); break;
                    case 'native': this.shareNative(gameData); break;
                }
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });

        document.getElementById('close-share-modal').addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s';
            setTimeout(() => overlay.remove(), 300);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.animation = 'fadeOut 0.3s';
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }
};

// Agregar animaciones CSS si no existen
if (!document.getElementById('lipa-share-animations')) {
    const style = document.createElement('style');
    style.id = 'lipa-share-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.LIPAShare = LIPAShare;
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LIPAShare;
}
