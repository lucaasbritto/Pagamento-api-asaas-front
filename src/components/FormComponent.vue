<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <span class="headline">Pagamento</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="processPayment">

                <!-- Dados Pessoais -->
                <v-card class="mb-4">
                  <v-card-title>
                    <span class="headline">Dados Pessoais</span>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="name"
                      label="Nome Completo"
                      required
                      :rules="[value => !!value || 'Nome é obrigatório']"
                    ></v-text-field>
  
                    <v-text-field
                      v-model="cpf"
                      label="CPF"
                      required
                      type="text"
                      maxlength="14"
                      :rules="[value => !!value || 'CPF é obrigatório']"
                      @input="formatCPF"
                    ></v-text-field>
  
                    <v-text-field
                      v-model="email"
                      label="Email"
                      required
                      type="email"
                      :rules="[value => !!value || 'Email é obrigatório']"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
  
                <!-- Tipo de Pagamento -->
                <v-radio-group v-model="paymentType" label="Tipo de Pagamento" required @change="handlePaymentTypeChange">
                  <v-radio label="Boleto" value="boleto"></v-radio>
                  <v-radio label="Cartão de Crédito" value="credit_card"></v-radio>
                  <v-radio label="Pix" value="pix"></v-radio>
                </v-radio-group>
  
                <v-text-field
                  v-model="amount"
                  label="Valor"
                  required
                  prefix="R$"
                  type="text"
                  :rules="[value => !!value || 'Valor é obrigatório']"
                  @input="formatCurrency"
                ></v-text-field>
  
                <!-- Abas de Dados do Cartão e Dados do Titular -->
                <v-tabs v-if="paymentType === 'credit_card'" v-model="tab" background-color="primary" dark>
                  <v-tab value="aba_cartao">Dados do Cartão</v-tab>
                  <v-tab value="aba_titular">Dados do Titular</v-tab>
                </v-tabs>
  
                <v-tabs-window v-if="paymentType === 'credit_card'" v-model="tab">
                  <v-tabs-window-item value="aba_cartao">
                    <v-card class="pa-4">
                      <v-card-title>
                        <span class="headline">Dados do Cartão</span>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="cardNumber"
                          label="Número do Cartão"
                          required
                          type="text"
                          maxlength="16"
                          :rules="[value => !!value || 'Número do cartão é obrigatório']"
                          @input="filterNonNumeric"
                        ></v-text-field>
  
                        <v-text-field
                          v-model="cardName"
                          label="Nome no Cartão"
                          required
                          type="text"
                          :rules="[value => !!value || 'Nome no cartão é obrigatório']"
                        ></v-text-field>
  
                        <v-text-field
                          v-model="expiryDateMonth"
                          label="Mês de Validade"
                          required
                          placeholder="MM"
                          maxlength="2"
                          :rules="expiryDateMounthRules"
                        ></v-text-field>

                        <v-text-field
                          v-model="expiryDateYear"
                          label="Ano de Validade"
                          required
                          placeholder="AAAA"
                          maxlength="4"
                          :rules="expiryDateYearRules"
                        ></v-text-field>
  
                        <v-text-field
                          v-model="cvc"
                          label="CVC"
                          required
                          type="text"
                          maxlength="3"
                          :rules="[value => !!value || 'CVC é obrigatório']"
                        ></v-text-field>

                      </v-card-text>
                    </v-card>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="aba_titular">
                    <v-card class="pa-4">
                      <v-card-title>
                        <span class="headline">Dados do Titular</span>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="nameUserCard"
                          label="Nome Titular do Cartão"
                          required
                          type="text"
                          class="mt-3"
                        ></v-text-field>

                        <v-text-field
                          v-model="emailUserCard"
                          label="E-mail Titular do Cartão"
                          required
                          type="text"
                          class="mt-3"
                        ></v-text-field>

                        <v-text-field
                          v-model="cpfUserCard"
                          label="CPF ou CPNJ do Titular"
                          required
                          type="text"
                          class="mt-3"
                          maxlength="14"
                          :rules="[value => !!value || 'CPF é obrigatório']"
                          @input="formatCPFCard"
                        ></v-text-field>

                        <v-text-field
                          v-model="cep"
                          label="CEP"
                          required
                          type="text"
                          class="mt-3"
                          @input="formatCEP"
                        ></v-text-field>

                        <v-text-field
                          v-model="addressNumber"
                          label="Numero do Endereço"
                          required
                          type="text"
                          class="mt-3"
                        ></v-text-field>
  
                        <v-text-field
                          v-model="phone"
                          label="Telefone"
                          required
                          type="text"
                          class="mt-3"
                          @input="formatPhone"
                        ></v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-tabs-window-item>
                </v-tabs-window>
  
                <v-btn type="submit" color="primary" :disabled="!isFormValid" class="mt-4">Finalizar Pagamento</v-btn>
              </v-form>

              <!-- Exibir erros específicos -->
              <v-alert v-if="errors.length > 0" type="error" class="mt-4">
                <ul>
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
              </v-alert>
  
              <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import api from '../services/api';
  
  export default {
    data() {
      return {
        name: '',
        cpf: '',
        email: '',
        paymentType: '',
        amount: '',
        cardNumber: '',
        cardName: '',
        expiryDateMonth: '',
        expiryDateYear: '',
        cvc: '',
        addressNumber: '',
        cep: '',
        phone: '',
        nameUserCard: '',
        emailUserCard: '',
        cpfUserCard: '',
        tab: 0,
        error: null,
        errors: [],
      };
    },
    computed: {
      isFormValid() {
        return this.name && this.cpf && this.email && this.paymentType && this.amount &&
               (this.paymentType === 'boleto' || this.paymentType === 'pix' || (this.paymentType === 'credit_card' && this.cardNumber && this.cardName && this.expiryDateMonth && this.expiryDateYear && this.cvc && this.addressNumber && this.cep && this.phone));
      },
      expiryDateMounthRules() {
        return [
            value => !!value || 'Mês de validade é obrigatório',
            value => value.length === 2 || 'Mês de validade deve ter exatamente 2 dígitos',
            value => (Number(value) >= 1 && Number(value) <= 12) || 'Mês de validade deve estar entre 01 e 12',
        ];
      },
      expiryDateYearRules() {
        return [
            value => !!value || 'Ano de validade é obrigatório',
            value => value.length === 4 || 'Ano de validade deve ter exatamente 4 dígitos',
            value => /^\d{4}$/.test(value) || 'Ano de validade deve conter apenas dígitos',
        ];
      },
    },
    methods: {
      formatCPF() {
        this.cpf = this.cpf.replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');         
      },
      formatCPFCard() {
        this.cpfUserCard = this.cpfUserCard.replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');         
      },
      filterNonNumeric() {      
        this.cardNumber = this.cardNumber.replace(/\D/g, '');
      },
      formatCurrency() {
        this.amount = this.amount.replace(/\D/g, '')
          .replace(/(\d)(\d{2})$/, '$1,$2')
          .replace(/(?=(\d{3})+(\D))\B/g, '.');
      },
      formatCEP() {
        this.cep = this.cep.replace(/\D/g, '')
          .replace(/(\d{5})(\d)/, '$1-$2');
      },
      formatPhone() {
        this.phone = this.phone.replace(/\D/g, '')
          .replace(/(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
      },
      handlePaymentTypeChange() {
        if (this.paymentType !== 'credit_card') {
          this.tab = 0;
        }
      },
      async processPayment() {
        try {
          const paymentData = {
            name: this.name,
            cpf: this.cpf,
            email: this.email,
            payment_type: this.paymentType,
            amount: parseFloat(this.amount.replace(/\./g, '').replace(',', '.')),
            card_number: this.cardNumber || null,
            card_name: this.cardName || null,
            expiry_date_month: this.expiryDateMonth || null,
            expiry_date_year: this.expiryDateYear || null,
            cvc: this.cvc || null,
            addressNumber: this.addressNumber || null,
            cep: this.cep || null,
            phone: this.phone || null,
            nameUserCard: this.nameUserCard || null,
            emailUserCard: this.emailUserCard || null,
            cpfUserCard: this.cpfUserCard || null,
          };
  
          // Processar Pagamento
          const response = await api.post('/process-payment', paymentData);
         
          if (response.data.status === 'error') {
                this.errors = response.data.messages;
            } else {
                this.$router.push({ name: 'PageCongratulation', params: { paymentData: JSON.stringify(response.data) } });
            }
        } catch (error) {        
            if (error.response && error.response.data) {
                this.errors = error.response.data.messages || ['Verifique os dados e tente novamente .'];
            } else {
                this.errors = ['Erro ao processar a requisição. Verifique sua conexão e tente novamente.'];
            }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .v-card-title {
    font-weight: bold;
  }
  </style>