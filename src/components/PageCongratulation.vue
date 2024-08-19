<template>
    <v-container class="text-center" max-width="600">
      <v-card class="mx-auto my-5" max-width="500">
        <v-card-title>
          <v-icon :color="cardIconColor" large>{{ cardIcon }}</v-icon>
        </v-card-title>
        <v-card-subtitle>
          <h1 class="message-title">{{ messageTitle }}</h1>
          <p class="message-body">{{ messageBody }}</p>
        </v-card-subtitle>

        <v-card-text>
          <!-- Para pagamentos com Boleto -->
          <template v-if="paymentData && paymentData.payment_type === 'boleto'">
            <v-btn
              :href="paymentData.data.bankSlipUrl"
              target="_blank"
              color="primary"
              class="mt-4"
            >
              Visualizar Boleto
            </v-btn>
          </template>
  
          <!-- Para pagamentos com Pix -->
          <template v-if="paymentData && paymentData.payment_type === 'pix'">
            <div class="text-center">
              <v-img
                v-if="paymentData.data.encodedImage"
                :src="`data:image/png;base64,${paymentData.data.encodedImage}`"
                max-width="300"
                max-height="300"
                class="my-4 mx-auto"
              ></v-img>
            </div>
            
            <v-alert type="info" class="mt-4">
              <span ref="copyField">{{ paymentData.data.payload }}</span>
            </v-alert>
            
            <v-btn
                v-if="paymentData.data.payload"
                @click="copyToClipboard"
                class="my-4 green-btn"
            >
                Copiar Código Pix
            </v-btn>
          </template>
  
          <!-- Para pagamentos com Cartão de Crédito -->
          <template v-if="paymentData && paymentData.payment_type === 'credit_card'">
           
            <v-alert v-if="paymentData.data.status === 'CONFIRMED'" type="success" border="left" prominent>
              {{ messageTitleAlert }}
            </v-alert>
            <v-alert v-else-if="paymentData.data.status !== 'CONFIRMED'" type="error" border="left" prominent>
                {{ messageTitleAlert }}                
            </v-alert>
            <a
                v-if="paymentData.data.status === 'CONFIRMED'"
                :href="paymentData.data.transactionReceiptUrl"
                target="_blank"
                class="v-btn v-btn--primary v-btn--text v-btn--small mt-4"
                role="button"
            >
                Ver Comprovante
            </a>
          </template>
  
          <!-- Para erros de pagamento -->
          <template v-if="paymentData && paymentData.status !== 'success'">
            <v-alert type="error" border="left" prominent>
              {{ errorMessage }}
            </v-alert>
          </template>

        </v-card-text>
  
        <v-card-actions class="justify-center">
          <v-btn @click="$router.push({ name: 'FormComponent' })" color="primary">
            Voltar para a Página Inicial
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        paymentData: null,
        messageTitle: '',
        messageBody: '',
        messageTitleAlert: '',
        errorMessage: 'Houve um erro ao processar o pagamento. Por favor, tente novamente mais tarde.',
        cardIcon: 'mdi-check-circle',
        cardIconColor: 'green',
      };
    },
    created() {
      this.paymentData = this.$route.params.paymentData
        ? JSON.parse(this.$route.params.paymentData)
        : null;

      if (this.paymentData) {
        if (this.paymentData.status === 'success') {
            if (this.paymentData.payment_type === 'boleto') {

                this.messageTitle = 'Seu boleto foi gerado com sucesso. Clique no botão abaixo para visualizá-lo.';
            
            } else if (this.paymentData.payment_type === 'pix') {  

                this.messageTitle = `Tudo certo! Agora é só realizar o pagamento no valor de ${this.formattedAmount}`;
                this.messageBody = 'Acesse seu APP de pagamentos, faça a leitura do QR Code ou cole o código abaixo:';
          
            } else if (this.paymentData.payment_type === 'credit_card') {

                if (this.paymentData.data.status === 'CONFIRMED') {
                this.messageTitle = 'Pagamento com cartão de credito';
                this.messageBody = `O Valor pago foi de ${this.formattedAmount} e o número da fatura é: ${this.paymentData.data.invoiceNumber}`;
                this.messageTitleAlert = 'Pagamento Efetuado com sucesso'
                this.cardIcon = 'mdi-check-circle';
                this.cardIconColor = 'green';
                } else {
                this.messageTitle = 'Pagamento Recusado';
                this.messageBody = 'O pagamento com cartão de crédito não foi aprovado. Verifique os dados do cartão.';
                this.messageTitleAlert = 'O pagamento ainda não foi confirmado. Por favor, aguarde a confirmação.'
                this.cardIcon = 'mdi-alert-circle';
                this.cardIconColor = 'orange';                
                }
            }
        } else {
          this.messageTitle = 'Pagamento Não Processado';
          this.messageBody = 'Houve um problema ao processar o pagamento. Por favor, tente novamente.';
          this.cardIcon = 'mdi-alert-circle';
          this.cardIconColor = 'red';
        }
      } else {
        this.messageTitle = 'Erro';
        this.messageBody = 'Não foi possível recuperar os dados do pagamento.';
        this.cardIcon = 'mdi-alert-circle';
        this.cardIconColor = 'red';
      }
    },

    computed: {
        formattedAmount() {
        return this.paymentData.amount ? 
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.paymentData.amount) : '';
        }
    },
    
    methods: {
      copyToClipboard() {
        const copyField = this.$refs.copyField;
  
        if (copyField) {
          const textToCopy = copyField.textContent;
          try {
            navigator.clipboard.writeText(textToCopy);
          } catch (err) {
            console.error('Erro ao copiar texto:', err);
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .message-title {
    white-space: normal; 
    word-wrap: break-word;
    margin: 0;
    font-size: 1.25rem; 
  }
  .message-body {
    white-space: normal;
    word-wrap: break-word;
    margin: 0;
    font-size: 0.9rem;
  }
  .v-card {
    padding: 16px;
  }
  </style>