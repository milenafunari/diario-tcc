let humorSelecionados = [];
function selectHumor(el, humor) {
  if (humorSelecionados.includes(humor)) {
    humorSelecionados = humorSelecionados.filter(h => h !== humor);
    el.classList.remove("selected");
  } else {
    if (humorSelecionados.length < 2) {
      humorSelecionados.push(humor);
      el.classList.add("selected");
    } else {
      alert("Você pode escolher até 2 humores principais.");
    }
  }
}
let medicamentos = [];
function addMedicamento() {
  const nome = document.getElementById("nome-medicamento").value.trim();
  const dose = document.getElementById("dose-medicamento").value.trim();
  const obs = document.getElementById("obs-medicamento").value.trim();
  if (!nome || !dose) {
    alert("Preencha nome e dosagem!");
    return;
  }
  medicamentos.push({ nome, dose, obs });
  atualizarMedList();
  document.getElementById("nome-medicamento").value = "";
  document.getElementById("dose-medicamento").value = "";
  document.getElementById("obs-medicamento").value = "";
}
function atualizarMedList() {
  const medListDiv = document.getElementById("med-list");
  medListDiv.innerHTML = "";
  medicamentos.forEach((med, i) => {
    const div = document.createElement("div");
    div.className = "med-item";
    div.innerHTML = `<span>${med.nome} - ${med.dose} ${med.obs ? ' ('+med.obs+')' : ''}</span>
      <button class="remove-btn" title="Remover" onclick="removerMed(${i})">&times;</button>`;
    medListDiv.appendChild(div);
  });
}
function removerMed(idx) {
  medicamentos.splice(idx, 1);
  atualizarMedList();
}
function showForm() {
  document.getElementById("main-view").style.display = "none";
  document.getElementById("form-view").style.display = "block";
  resetarForm();
  // Data padrão: hoje
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const dd = String(hoje.getDate()).padStart(2, '0');
  document.getElementById("data-registro").value = `${yyyy}-${mm}-${dd}`;
}
function voltar() {
  document.getElementById("form-view").style.display = "none";
  document.getElementById("main-view").style.display = "block";
  carregarHistorico();
  renderHumorChart();
}
function salvarRegistro() {
  // DATA DO REGISTRO (novo)
  const dataInput = document.getElementById("data-registro").value;
  if (!dataInput) {
    alert("Escolha a data do registro!");
    return;
  }
  const [yyyy, mm, dd] = dataInput.split('-');
  const data = `${dd}/${mm}/${yyyy}`;

  const horasSono = document.getElementById("horas-sono").value;
  const horaDormir = document.getElementById("hora-dormir").value;
  const horaAcordar = document.getElementById("hora-acordar").value;
  const qualidadeSono = document.getElementById("qualidade-sono").value;
  const dif = [
    document.getElementById("dif-pegar").checked ? "Pegar no sono" : null,
    document.getElementById("dif-manter").checked ? "Manter o sono" : null,
    document.getElementById("dif-sair").checked ? "Sair da cama" : null
  ].filter(Boolean);
  const humorDesc = document.getElementById("humor-desc").value;
  if (!horasSono || !horaDormir || !horaAcordar || !qualidadeSono) {
    alert("Preencha todas as informações de Sono!");
    return;
  }
  if (medicamentos.length === 0) {
    alert("Adicione pelo menos um medicamento.");
    return;
  }
  if (humorSelecionados.length === 0) {
    alert("Escolha pelo menos um humor.");
    return;
  }
  const sinais = [
    document.getElementById("alerta-sono").checked ? "Sono diminuído" : null,
    document.getElementById("alerta-pensamentos").checked ? "Pensamentos acelerados" : null,
    document.getElementById("alerta-gastos").checked ? "Gastos impulsivos" : null,
    document.getElementById("alerta-irritabilidade").checked ? "Irritabilidade fora do comum" : null,
    document.getElementById("alerta-interesse").checked ? "Perda de interesse" : null,
    document.getElementById("alerta-fora").checked ? "Sensação de estar fora do ar" : null,
    document.getElementById("alerta-vontade").checked ? "Vontade de sumir/desistir" : null,
  ].filter(Boolean);
  const autocuidado = [
    document.getElementById("auto-horario").checked ? "Dormi/acordei no horário" : null,
    document.getElementById("auto-sol").checked ? "Tomei sol/saí de casa" : null,
    document.getElementById("auto-comi").checked ? "Comi em horários razoáveis" : null,
    document.getElementById("auto-agua").checked ? "Bebi água suficiente" : null,
    document.getElementById("auto-rede").checked ? "Evitei redes sociais em excesso" : null,
    document.getElementById("auto-mexi").checked ? "Mexi o corpo" : null,
    document.getElementById("auto-prazer").checked ? "Fiz algo prazeroso" : null,
    document.getElementById("auto-amigo").checked ? "Falei com alguém querido" : null,
  ].filter(Boolean);
  const reflexao = document.getElementById("reflexao").value;
  const gatilho = document.getElementById("gatilho").value;
  const reacao = document.getElementById("reacao").value;

  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  historico.unshift({
    data,
    sono: { horasSono, horaDormir, horaAcordar, qualidadeSono, dif },
    medicamentos: JSON.parse(JSON.stringify(medicamentos)),
    humor: { humorSelecionados, humorDesc },
    sinais,
    autocuidado,
    reflexao,
    gatilho,
    reacao
  });
  localStorage.setItem("historicoEstabilidade", JSON.stringify(historico));
  alert("Registro salvo com sucesso! 🙌");
  voltar();
}
function resetarForm() {
  document.getElementById("horas-sono").value = "";
  document.getElementById("hora-dormir").value = "";
  document.getElementById("hora-acordar").value = "";
  document.getElementById("qualidade-sono").selectedIndex = 0;
  document.getElementById("dif-pegar").checked = false;
  document.getElementById("dif-manter").checked = false;
  document.getElementById("dif-sair").checked = false;
  medicamentos = [];
  atualizarMedList();
  document.querySelectorAll(".emoji-option").forEach(e => e.classList.remove("selected"));
  humorSelecionados = [];
  document.getElementById("humor-desc").value = "";
  [
    "alerta-sono", "alerta-pensamentos", "alerta-gastos", "alerta-irritabilidade", "alerta-interesse", "alerta-fora", "alerta-vontade",
    "auto-horario", "auto-sol", "auto-comi", "auto-agua", "auto-rede", "auto-mexi", "auto-prazer", "auto-amigo"
  ].forEach(id => document.getElementById(id).checked = false);
  document.getElementById("reflexao").value = "";
  document.getElementById("gatilho").value = "";
  document.getElementById("reacao").value = "";
}
function carregarHistorico() {
  const histDiv = document.getElementById("history");
  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  histDiv.innerHTML = "";
  if (historico.length === 0) {
    histDiv.innerHTML = "<div class='history-card'>Nenhum registro ainda.</div>";
    return;
  }
  historico.forEach(reg => {
    let medStr = reg.medicamentos.map(m => `${m.nome} (${m.dose}${m.obs ? ", " + m.obs : ""})`).join("; ");
    let humorStr = reg.humor.humorSelecionados.join(", ");
    let sinaisStr = reg.sinais.join(", ");
    let autocuidadoStr = reg.autocuidado.join(", ");
    histDiv.innerHTML += `
    <div class="history-card">
      <b>${reg.data}</b><br>
      <b>Sono:</b> ${reg.sono.horasSono}h, dormiu ${reg.sono.horaDormir}, acordou ${reg.sono.horaAcordar}, qualidade: ${reg.sono.qualidadeSono} ${reg.sono.dif.length > 0 ? "(" + reg.sono.dif.join(", ") + ")" : ""}<br>
      <b>Medicação:</b> ${medStr}<br>
      <b>Humor:</b> ${humorStr}${reg.humor.humorDesc ? " - " + reg.humor.humorDesc : ""}<br>
      <b>Sinais de alerta:</b> ${sinaisStr || "nenhum"}<br>
      <b>Autocuidado:</b> ${autocuidadoStr || "nenhum"}<br>
      <b>Reflexão:</b> ${reg.reflexao || "—"}<br>
      <b>Gatilho & Reação:</b> ${reg.gatilho || "—"} / ${reg.reacao || "—"}
    </div>
    `;
  });
}
let humorChart;
function renderHumorChart() {
  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  const humorMap = {
    "Muito triste": 0,
    "Triste": 1,
    "Sem energia": 2,
    "Estável": 3,
    "Ansiosa": 2,
    "Irritada": 2,
    "Acelerada": 4,
    "Feliz": 5,
    "Motivada": 5,
    "Confiante": 4
  };
  let labels = [], data = [], emojis = [];
  historico.slice(0, 15).reverse().forEach(reg => {
    labels.push(reg.data);
    let h = reg.humor.humorSelecionados && reg.humor.humorSelecionados[0];
    data.push(humorMap[h] !== undefined ? humorMap[h] : 3);
    let emoji = "😐";
    switch (h) {
      case "Muito triste": emoji = "😭"; break;
      case "Triste": emoji = "😔"; break;
      case "Sem energia": emoji = "🥱"; break;
      case "Estável": emoji = "🙂"; break;
      case "Ansiosa": emoji = "😬"; break;
      case "Irritada": emoji = "😠"; break;
      case "Acelerada": emoji = "🤩"; break;
      case "Feliz": emoji = "😄"; break;
      case "Motivada": emoji = "🥳"; break;
      case "Confiante": emoji = "😎"; break;
    }
    emojis.push(emoji);
  });
  if (humorChart) humorChart.destroy();
  const ctx = document.getElementById("humorChart").getContext('2d');
  humorChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Humor',
        data,
        fill: true,
        borderColor: "#8857d4",
        backgroundColor: "rgba(186, 151, 243, 0.12)",
        pointBackgroundColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.45,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: 5,
          stepSize: 1,
          ticks: {
            callback: function(val) {
              return ["Muito triste","Triste","Sem energia","Estável","Acelerada/Feliz","Confiante"][val] || "";
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Humor: " + data[context.dataIndex] + " ("+emojis[context.dataIndex]+")";
            }
          }
        }
      }
    }
  });
}

// Função PDF delicada e personalizada
async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  let historico = JSON.parse(localStorage.getItem("historicoEstabilidade") || "[]");
  const doc = new jsPDF();

  // Capa/Topo
  let y = 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(136, 87, 212); // Lavanda!
  doc.text("Estabilidade.me", 105, y, {align: "center"});
  y += 10;
  doc.setFontSize(13);
  doc.setTextColor(80,60,100);
  doc.setFont("helvetica", "normal");
  doc.text("Diário Emocional", 105, y, {align: "center"});
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(136, 87, 212);
  doc.text("💡 Seus dados ficam salvos só neste dispositivo. Cuide de você com carinho!", 105, y, {align:"center"});
  y += 6;
  doc.setTextColor(60, 40, 70);
  doc.line(20, y+2, 190, y+2);
  y += 10;

  // Registros
  historico.forEach((reg, idx) => {
    if (y > 255) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(136, 87, 212);
    doc.text(`📅 ${reg.data}`, 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 40, 70);
    doc.text(`🛏️ Sono: ${reg.sono.horasSono}h • dormiu ${reg.sono.horaDormir} • acordou ${reg.sono.horaAcordar} • qualidade: ${reg.sono.qualidadeSono}` + (reg.sono.dif.length > 0 ? ` (${reg.sono.dif.join(", ")})` : ""), 24, y);
    y += 6;
    doc.text(`💊 Medicação: ${reg.medicamentos.map(m => `${m.nome} (${m.dose}${m.obs ? ", " + m.obs : ""})`).join("; ")}`, 24, y);
    y += 6;
    doc.text(`😊 Humor: ${reg.humor.humorSelecionados.join(", ")}${reg.humor.humorDesc ? " — " + reg.humor.humorDesc : ""}`, 24, y);
    y += 6;
    doc.text(`⚠️ Sinais: ${reg.sinais.join(", ") || "nenhum"}`, 24, y);
    y += 6;
    doc.text(`🌱 Autocuidado: ${reg.autocuidado.join(", ") || "nenhum"}`, 24, y);
    y += 6;
    doc.text(`📝 Reflexão: ${reg.reflexao || "—"}`, 24, y);
    y += 6;
    doc.text(`🚧 Gatilho: ${reg.gatilho || "—"} • Reação: ${reg.reacao || "—"}`, 24, y);
    y += 10;
    doc.setTextColor(230,210,255);
    doc.line(22, y-2, 170, y-2);
    doc.setTextColor(60,40,70);
  });

  // Rodapé
  doc.setFontSize(10);
  doc.setTextColor(136, 87, 212);
  doc.setFont("helvetica", "italic");
  doc.text("Estabilidade.me • Saúde mental com leveza 💜", 105, 290, {align:"center"});

  doc.save("estabilidademe_historico.pdf");
}

carregarHistorico();
renderHumorChart();
