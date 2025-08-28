import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RomanticGift = () => {
  // Estados da aplicação
  const [hoverCount, setHoverCount] = useState(0);
  const [alreadyChangedLastName, setAlreadyChangedLastName] = useState(false);
  const [alreadyChangedPresentConfirm, setAlreadyChangedPresentConfirm] = useState(false);
  const [beautyErrorProcessed, setBeautyErrorProcessed] = useState(false);
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showNameConfirm1, setShowNameConfirm1] = useState(false);
  const [showNameConfirm2, setShowNameConfirm2] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showFinal, setShowFinal] = useState(false);
  const [showGenericError, setShowGenericError] = useState(false);
  const [showBeautyError1, setShowBeautyError1] = useState(false);
  const [showBeautyError2, setShowBeautyError2] = useState(false);
  const [genericErrorText, setGenericErrorText] = useState("");
  
  // Form values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [beautyLevel, setBeautyLevel] = useState("");
  const [fullName, setFullName] = useState("");
  const [boyfriendName, setBoyfriendName] = useState("");
  const [boyfriendAge, setBoyfriendAge] = useState("");
  const [presentConfirm, setPresentConfirm] = useState("");

  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const MAX_HOVERS = 4;

  // Funções utilitárias
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const limitInput = (value: string) => {
    let numValue = parseInt(value);
    if (numValue > 10) numValue = 10;
    if (numValue <= 0) numValue = 0;
    return numValue.toString();
  };

  // Handlers do modal inicial
  const handleYesHover = () => {
    if (hoverCount < MAX_HOVERS && yesBtnRef.current) {
      const modalContent = yesBtnRef.current.closest('.modal-content');
      if (modalContent) {
        const modalWidth = modalContent.clientWidth;
        const modalHeight = modalContent.clientHeight;
        const btnWidth = yesBtnRef.current.offsetWidth;
        const btnHeight = yesBtnRef.current.offsetHeight;
        const maxX = modalWidth - btnWidth;
        const maxY = modalHeight - btnHeight;
        
        yesBtnRef.current.style.position = "absolute";
        yesBtnRef.current.style.top = `${Math.random() * maxY}px`;
        yesBtnRef.current.style.left = `${Math.random() * maxX}px`;
        setHoverCount(hoverCount + 1);
      }
    }
  };

  const handleYesClick = () => {
    if (hoverCount >= MAX_HOVERS) {
      setShowInitialModal(false);
      setShowNameConfirm1(true);
    }
  };

  const closeInitialModal = () => {
    setShowInitialModal(false);
    setShowNameConfirm1(false);
    setShowNameConfirm2(false);
  };

  const closePresent = () => {
    if (confirm("Tem certeza que não quer abrir seu presente?")) {
      document.body.innerHTML = "<h1>Ok, até a próxima! 🎁</h1>";
      setTimeout(() => location.reload(), 500);
    }
  };

  const handleNameConfirm1 = () => {
    setShowNameConfirm1(false);
    setShowNameConfirm2(true);
  };

  const handleNameConfirm2 = () => {
    setShowNameConfirm2(false);
    openGift();
  };

  const openGift = () => {
    setShowWizard(true);
    setCurrentStep(1);
  };

  // Validações
  const showGenericErrorModal = (message: string) => {
    setGenericErrorText(message);
    setShowGenericError(true);
  };

  const validateStep1 = () => {
    const vitoriaAge = calculateAge("2003-04-27");
    const lastNameNormalized = normalizeText(lastName.trim());

    if (normalizeText(firstName.trim()) !== "vitoria") {
      return showGenericErrorModal("O primeiro nome parece incorreto.");
    }

    if (!alreadyChangedLastName) {
      if (lastNameNormalized === "vicente") {
        setAlreadyChangedLastName(true);
        setTimeout(() => setLastName("Bobinha"), 500);
        return showGenericErrorModal("Você errou seu segundo nome, Você realmente é ela?");
      } else {
        setTimeout(() => setLastName("Bobinha"), 500);
        return showGenericErrorModal("O segundo nome está errado...");
      }
    } else {
      if (lastNameNormalized !== "vicente") {
        return showGenericErrorModal("O segundo nome está errado...");
      }
    }

    if (parseInt(age) !== vitoriaAge) {
      return showGenericErrorModal(`Tem certeza que essa é sua idade?`);
    }

    if (!beautyLevel) {
      return showGenericErrorModal("Por favor, preencha o nível de beleza.");
    }

    if (parseInt(beautyLevel) < 99999999) {
      if (!beautyErrorProcessed) {
        setBeautyErrorProcessed(true);
        return setShowBeautyError1(true);
      }
    }

    setTimeout(() => setCurrentStep(2), 1000);
  };

  const validateStep2 = () => {
    const fullNameNormalized = normalizeText(fullName.trim());
    const boyfriendNameNormalized = normalizeText(boyfriendName.trim());
    const joaoAge = calculateAge("2003-11-13");
    const presentConfirmNormalized = normalizeText(presentConfirm.trim());
    
    const affirmativeAnswers = [
      "sim", "quero", "claro", "aceito", "pode", "s", "simmmm", "simmm", "siim",
      "old que sim", "juro", "juroooo", "juuuroooo",
    ];

    if (fullNameNormalized !== "vitoria vicente da silva") {
      return showGenericErrorModal("Errou seu proprio nome? Ta ruim de memoria ein...");
    }

    if (!boyfriendNameNormalized.includes("joao")) {
      return showGenericErrorModal("Serio que Você esqueceu meu nome? kkkkkkk");
    }

    if (parseInt(boyfriendAge) !== joaoAge) {
      return showGenericErrorModal(`Esqueceu minha idade? Vou te ajudar, minha idade é ${joaoAge}`);
    }

    if (!alreadyChangedPresentConfirm) {
      if (affirmativeAnswers.some(ans => presentConfirmNormalized.includes(ans))) {
        setAlreadyChangedPresentConfirm(true);
        setPresentConfirm("NÃO");
        return showGenericErrorModal("Você não quer abrir o presente?");
      } else {
        setPresentConfirm("NÃO");
        return showGenericErrorModal("Você realmente não quer abrir o presente?");
      }
    } else {
      if (!affirmativeAnswers.some(ans => presentConfirmNormalized.includes(ans))) {
        return showGenericErrorModal("Corrija para 'Sim' ou equivalente para continuar...");
      }
    }

    setShowWizard(false);
    setShowFinal(true);
  };

  const resetToStart = () => {
    location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-romantic-light flex items-center justify-center p-4">
      {/* Background romântico */}
      <div className="romantic-bg">
        <div className="floating-hearts">
          <span className="heart">💖</span>
          <span className="heart">💕</span>
          <span className="heart">💗</span>
          <span className="heart">💝</span>
          <span className="heart">💘</span>
        </div>
      </div>

      {/* Overlay */}
      {(showInitialModal || showNameConfirm1 || showNameConfirm2 || showGenericError || showBeautyError1 || showBeautyError2) && (
        <div className="modal-overlay animate-fade-in-up" />
      )}

      {/* Modal Inicial */}
      {showInitialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="card-romantic animate-scale-in modal-content max-w-md w-full relative">
            <CardContent className="p-8 text-center">
              <div className="sparkle mb-6">
                <h2 className="text-2xl font-bold text-romantic font-dancing mb-4">
                  💝 ESSE É UM PRESENTE CONFIDENCIAL E EXCLUSIVO 💝
                </h2>
              </div>
              <p className="text-lg mb-8 text-foreground">
                TEM CERTEZA QUE FOI PRA VOCÊ E DESEJA ABRI-LO?
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  ref={yesBtnRef}
                  variant="romantic"
                  className="relative"
                  onMouseEnter={handleYesHover}
                  onClick={handleYesClick}
                >
                  <span className="heart-beat">💖</span> SIM
                </Button>
                <Button
                  variant="romantic-danger"
                  onClick={closePresent}
                >
                  💔 NÃO
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Confirmação Nome 1 */}
      {showNameConfirm1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="card-romantic animate-scale-in max-w-md w-full">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-dancing text-romantic mb-6">
                🌹 Seu nome é Vitória Vicente?? 🌹
              </h3>
              <div className="flex gap-4 justify-center">
                <Button variant="romantic" onClick={handleNameConfirm1}>
                  💕 Sim
                </Button>
                <Button variant="romantic-danger" onClick={closeInitialModal}>
                  💔 Não
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Confirmação Nome 2 */}
      {showNameConfirm2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="card-romantic animate-scale-in max-w-md w-full">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-dancing text-romantic mb-6">
                ✨ Tem certeza que Você é Vitória Vicente da Silva? ✨
              </h3>
              <div className="flex gap-4 justify-center">
                <Button variant="romantic" onClick={handleNameConfirm2}>
                  💖 Sim
                </Button>
                <Button variant="romantic-danger" onClick={closeInitialModal}>
                  💔 Não
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      {showWizard && (
        <div className="fixed top-4 left-0 right-0 z-40">
          <div className="text-center">
            <h1 className="text-3xl font-dancing text-romantic romantic-float">
              💕 Meu Presente Especial para Você 💕
            </h1>
          </div>
        </div>
      )}

      {/* Wizard Container */}
      {showWizard && (
        <div className="w-full max-w-2xl mx-auto mt-20">
          {currentStep === 1 && (
            <Card className="card-romantic animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-dancing text-romantic">
                  💝 SE VOCÊ É REALMENTE ELA, PREENCHA O PEQUENO FORMULÁRIO DE 23 PÁGINAS ABAIXO 💝
                </CardTitle>
                <div className="text-sm text-muted-foreground font-semibold">
                  📄 1/23
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    🌸 Primeiro nome:
                  </label>
                  <Input
                    className="input-romantic text-center"
                    placeholder="Primeiro nome"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    🌺 Segundo nome:
                  </label>
                  <Input
                    className="input-romantic text-center"
                    placeholder="Segundo nome"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    🎂 Idade:
                  </label>
                  <Input
                    className="input-romantic text-center"
                    type="number"
                    placeholder="Sua idade"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    ✨ Nivel de Beleza:
                  </label>
                  <Input
                    className={`input-romantic text-center ${
                      beautyLevel === "9999999999999999999999999999999999" 
                        ? "special-beauty-input" 
                        : ""
                    }`}
                    type="number"
                    placeholder="0-10"
                    min="0"
                    max="10"
                    value={beautyLevel}
                    onChange={(e) => setBeautyLevel(limitInput(e.target.value))}
                  />
                  {beautyLevel === "9999999999999999999999999999999999" && (
                    <div className="beauty-crown text-center animate-heartbeat">
                      ✨👑✨ PERFEIÇÃO ABSOLUTA ✨👑✨
                    </div>
                  )}
                </div>
                <div className="text-center pt-4">
                  <Button variant="romantic" onClick={validateStep1}>
                    💕 Próxima Página
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="card-romantic animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-dancing text-romantic">
                  😄 BRINCADEIRA, SÃO SÓ 2 PÁGINAS<br />
                  💭 AINDA NÃO TO CONVENCIDO, PREENCHA SEU NOME COMPLETO
                </CardTitle>
                <div className="text-sm text-muted-foreground font-semibold">
                  📄 2/2
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    👤 Nome Completo:
                  </label>
                  <Input
                    className="input-romantic text-center"
                    placeholder="Nome Completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    💕 Nome do seu Namorado:
                  </label>
                  <Input
                    className="input-romantic text-center"
                    placeholder="Nome do Namorado"
                    value={boyfriendName}
                    onChange={(e) => setBoyfriendName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    🎂 Idade dele:
                  </label>
                  <Input
                    className="input-romantic text-center"
                    type="number"
                    placeholder="Idade do Namorado"
                    value={boyfriendAge}
                    onChange={(e) => setBoyfriendAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block text-left">
                    🎁 Você quer mesmo abrir o presente?
                  </label>
                  <Input
                    className="input-romantic text-center"
                    placeholder="Sim, quero, etc."
                    value={presentConfirm}
                    onChange={(e) => setPresentConfirm(e.target.value)}
                  />
                </div>
                <div className="text-center pt-4">
                  <Button variant="romantic" onClick={validateStep2}>
                    💖 Ver Surpresa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Seção Final */}
      {showFinal && (
        <div className="w-full max-w-6xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-dancing text-romantic mb-12 heart-beat">
            💖 Te amo Vitoria Vicente 💖
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { emoji: "💕", title: "Nosso primeiro encontro", text: "Eu penso em Você o dia todo ♥" },
              { emoji: "❤️", title: "Momentos especiais", text: "Vitoria, Você me inspira a ser melhor ♥" },
              { emoji: "💖", title: "Nossos sorrisos", text: "Nosso amor é eterno" },
              { emoji: "💝", title: "Juntos", text: "Te amo Vitoria mais que tudo" },
              { emoji: "💗", title: "Aventuras", text: "Minha pessoa favorita ♥" },
              { emoji: "💘", title: "Amor verdadeiro", text: "Cada dia com Você Vitoria é uma benção" }
            ].map((card, index) => (
              <div
                key={index}
                className="photo-card-romantic animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-3 -right-3 text-2xl animate-heartbeat">
                  {card.emoji}
                </div>
                <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center mb-4 shadow-romantic">
                  <span className="text-4xl">📷</span>
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {card.title}
                  </span>
                </div>
                <p className="font-dancing text-lg text-romantic font-bold leading-relaxed">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
          
          <Button variant="romantic" className="text-lg px-12 py-4" onClick={resetToStart}>
            🎊 Finalizar
          </Button>
        </div>
      )}

      {/* Modal de Erro Genérico */}
      {showGenericError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="card-romantic animate-scale-in max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg mb-6">{genericErrorText}</p>
              <Button
                variant="romantic-danger"
                onClick={() => setShowGenericError(false)}
              >
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Erro de Beleza 1 */}
      {showBeautyError1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="card-romantic animate-scale-in max-w-sm w-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                ✗
              </div>
              <h4 className="text-lg font-bold mb-2">Muito Errado!!!</h4>
              <hr className="my-3" />
              <p className="mb-4">Só isso de beleza?<br />Isso tá errado!!</p>
              <Button
                variant="romantic-danger"
                onClick={() => {
                  setShowBeautyError1(false);
                  setShowBeautyError2(true);
                }}
              >
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Erro de Beleza 2 */}
      {showBeautyError2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="card-romantic animate-scale-in max-w-sm w-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                !
              </div>
              <h4 className="text-lg font-bold mb-2">Melhor Assim!!</h4>
              <hr className="my-3" />
              <p className="mb-4">Olha de novo<br />agora sim está certo!!!</p>
              <Button
                variant="romantic"
                onClick={() => {
                  setShowBeautyError2(false);
                  setBeautyLevel("9999999999999999999999999999999999");
                  setTimeout(() => validateStep1(), 300);
                }}
              >
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RomanticGift;
