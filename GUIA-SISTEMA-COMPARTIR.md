# 🎁 SISTEMA DE COMPARTIR + RECOMPENSAS - LIPA STUDIOS

## 🌟 CARACTERÍSTICAS

### **Funcionalidades Principales:**
- ✅ Compartir en 6 plataformas (Twitter, Facebook, WhatsApp, Telegram, Clipboard, Nativo)
- ✅ Sistema de recompensas (+50 puntos por share)
- ✅ Cooldown de 30 minutos entre recompensas
- ✅ Contador de shares totales
- ✅ Texto personalizado por juego
- ✅ Modal visual atractivo
- ✅ Notificaciones animadas
- ✅ Analytics integrado
- ✅ 100% responsive

---

## 📥 IMPLEMENTACIÓN

### **1. Incluir el Script**
Añade en el `<head>` o antes de `</body>`:

```html
<script src="/share-system.js"></script>
```

### **2. Llamar al Compartir**
Cuando el jugador termina una partida:

```javascript
// Al finalizar el juego
function onGameEnd(score) {
    // Mostrar modal de compartir
    LIPAShare.showShareModal({
        gameName: 'Stack Tower Neon',
        score: score,
        achievement: score > 1000 ? 'Maestro Constructor' : 'Gran Jugador',
        emoji: '🏗️',
        customMessage: `¡Alcancé ${score} bloques en Stack Tower Neon!`
    });
}
```

---

## 🎮 EJEMPLOS POR JUEGO

### **Stack Tower Neon**
```javascript
LIPAShare.showShareModal({
    gameName: 'Stack Tower Neon',
    score: userScore,
    achievement: userScore > 2000 ? '👑 Leyenda' : 
                 userScore > 1000 ? '💎 Maestro' : 
                 userScore > 500 ? '⭐ Experto' : '🎯 Jugador',
    emoji: '🏗️',
    customMessage: `¡${userScore} bloques apilados sin fallar!`
});
```

### **Math Blitz**
```javascript
LIPAShare.showShareModal({
    gameName: 'Math Blitz',
    score: correctAnswers,
    achievement: correctAnswers >= 60 ? '🧠 Genio Matemático' : 
                 correctAnswers >= 40 ? '🎓 Cerebrito' : '📊 Rápido',
    emoji: '🧮',
    customMessage: `¡${correctAnswers} operaciones correctas en 60 segundos!`
});
```

### **Neon Runner WOW**
```javascript
LIPAShare.showShareModal({
    gameName: 'Neon Runner WOW',
    score: finalScore,
    achievement: distance > 5000 ? '🏆 Maratonista' : 
                 distance > 2000 ? '🔥 Veloz' : '⚡ Corredor',
    emoji: '🏃',
    customMessage: `¡${distance}m de distancia en Neon Runner!`
});
```

### **Idol Agency Tycoon**
```javascript
LIPAShare.showShareModal({
    gameName: 'Idol Agency Tycoon',
    score: totalRevenue,
    achievement: `Nivel ${playerLevel} - ${idolCount} Idols`,
    emoji: '🎤',
    customMessage: `¡Mi imperio K-pop genera €${totalRevenue}/día!`
});
```

---

## 🎁 SISTEMA DE RECOMPENSAS

### **Cómo Funciona:**
1. Usuario completa partida y ve modal de compartir
2. Comparte en cualquier red social
3. Recibe **+50 puntos** instantáneamente
4. Debe esperar **30 minutos** para la siguiente recompensa
5. Puntos se acumulan sin límite

### **Obtener Puntos del Usuario:**
```javascript
// Obtener puntos totales
const points = LIPAShare.getRewardPoints();
console.log(`Usuario tiene ${points} puntos`);

// Obtener número de veces compartido
const shares = LIPAShare.getShareCount();
console.log(`Ha compartido ${shares} veces`);
```

### **Usar Puntos (Implementación Futura):**
```javascript
// Ejemplo: Canjear puntos por ventajas
if (LIPAShare.getRewardPoints() >= 500) {
    // Desbloquear skin especial
    unlockSpecialSkin();
    
    // Restar puntos (implementar según necesites)
    const current = LIPAShare.getRewardPoints();
    localStorage.setItem('lipa_reward_points', (current - 500).toString());
}
```

---

## 🎨 PERSONALIZACIÓN

### **Cambiar Configuración:**
```javascript
// Modificar recompensa
LIPAShare.config.rewardPoints = 100; // En lugar de 50

// Modificar cooldown
LIPAShare.config.cooldownMinutes = 60; // En lugar de 30

// Cambiar hashtags
LIPAShare.config.hashtags = ['LIPAStudios', 'GamingSpain', 'JuegosHTML5'];
```

### **Personalizar Notificaciones:**
```javascript
// Notificación personalizada
LIPAShare.showNotification('🎉 ¡Logro desbloqueado!', 'success');
LIPAShare.showNotification('⚠️ Necesitas más puntos', 'error');
LIPAShare.showNotification('💡 Consejo útil aquí', 'info');
LIPAShare.showNotification('💰 +100 puntos bonus!', 'reward');
```

---

## 📊 TRACKING Y ANALYTICS

### **Eventos que se Envían a Google Analytics:**
```javascript
// share - Cuando usuario comparte
gtag('event', 'share', {
    method: 'twitter',        // plataforma
    content_type: 'game_score',
    item_id: 'Stack Tower Neon'  // nombre del juego
});

// share_reward - Cuando usuario recibe recompensa
gtag('event', 'share_reward', {
    platform: 'whatsapp',
    points: 50
});
```

### **Ver Analytics:**
1. Google Analytics → Eventos → share
2. Ver qué plataforma es más popular
3. Ver qué juegos se comparten más

---

## 🚀 IDEAS DE MEJORA FUTURAS

### **1. Tienda de Recompensas**
```javascript
const rewards = [
    { name: 'Skin Dorado', cost: 500, type: 'cosmetic' },
    { name: 'Vidas Extra x3', cost: 200, type: 'powerup' },
    { name: 'Sin Anuncios 24h', cost: 1000, type: 'premium' },
    { name: 'Doble Puntos', cost: 300, type: 'boost' }
];
```

### **2. Logros por Compartir**
- 🥉 Influencer (10 shares)
- 🥈 Viral (50 shares)
- 🥇 Leyenda (100 shares)

### **3. Bonos Especiales**
- Primera vez compartiendo: +100 puntos
- Compartir en todas las redes: +250 puntos bonus
- Rachas diarias de shares: multiplicador x2

### **4. Referidos**
- Generar código único por usuario
- +200 puntos por cada amigo que juegue

---

## 💻 CÓDIGO COMPLETO DE INTEGRACIÓN

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Juego - LIPA Studios</title>
    <!-- Sistema de compartir -->
    <script src="/share-system.js"></script>
</head>
<body>
    <div id="game">
        <!-- Tu juego aquí -->
    </div>

    <script>
        // Cuando termina el juego
        function gameOver(score) {
            // Guardar best score
            const bestScore = parseInt(localStorage.getItem('best_score') || '0');
            if (score > bestScore) {
                localStorage.setItem('best_score', score.toString());
            }

            // Mostrar pantalla de Game Over
            showGameOverScreen(score);

            // Mostrar modal de compartir después de 1 segundo
            setTimeout(() => {
                LIPAShare.showShareModal({
                    gameName: 'Mi Juego Increíble',
                    score: score,
                    achievement: score > bestScore ? '🎉 ¡NUEVO RÉCORD!' : '🎮 Buen Intento',
                    emoji: '🎮',
                    customMessage: `¡Logré ${score} puntos!`
                });
            }, 1000);
        }

        // Mostrar puntos de recompensa en UI
        function updateRewardDisplay() {
            const points = LIPAShare.getRewardPoints();
            document.getElementById('reward-points').textContent = points;
        }

        // Llamar al inicio
        updateRewardDisplay();
    </script>
</body>
</html>
```

---

## 📱 COMPATIBILIDAD

| Plataforma | Twitter | Facebook | WhatsApp | Telegram | Copy | Nativo |
|------------|---------|----------|----------|----------|------|--------|
| Chrome Desktop | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Firefox Desktop | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Safari Desktop | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Chrome Mobile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Safari iOS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Firefox Mobile | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |

---

## 🎯 MÉTRICAS ESPERADAS

Con este sistema implementado en 16 juegos:

**Proyección Conservadora:**
- 10% de jugadores comparten (100 shares/día)
- 20% de sus seguidores hacen clic (20 visitas/día)
- Crecimiento orgánico: +600 visitas/mes

**Proyección Optimista:**
- 25% de jugadores comparten (250 shares/día)
- 30% de seguidores hacen clic (75 visitas/día)
- Crecimiento orgánico: +2,250 visitas/mes

**ROI:**
- Costo implementación: 0€ (ya hecho)
- Ganancia por tráfico nuevo: Variable según monetización
- Viralidad: Exponencial si el contenido compartido es atractivo

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

Para cada juego:
- [ ] Incluir `share-system.js`
- [ ] Llamar `LIPAShare.showShareModal()` al terminar partida
- [ ] Personalizar emoji y mensajes
- [ ] Definir logros según puntaje
- [ ] Probar en móvil y desktop
- [ ] Verificar Analytics funciona
- [ ] Añadir indicador de puntos en UI

---

## 🎉 RESULTADO

**Beneficios Inmediatos:**
- ✅ Viralidad orgánica (cada share = nuevos usuarios)
- ✅ Engagement aumentado (recompensas = retención)
- ✅ Data valiosa (qué juegos son más compartidos)
- ✅ Comunidad activa (usuarios compiten por puntos)
- ✅ SEO indirecto (backlinks desde redes sociales)

**Proyección a 3 meses:**
- 5,000-10,000 shares totales
- 2,000-4,000 nuevos usuarios desde shares
- +30-50% aumento en tiempo en sitio
- Comunidad de usuarios recurrentes

---

🚀 **SISTEMA LISTO PARA IMPLEMENTAR EN TODOS LOS JUEGOS**
