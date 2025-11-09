# Configuration de la réinitialisation de mot de passe

## Fonctionnalité implémentée

La fonctionnalité "J'ai oublié mon mot de passe" a été entièrement implémentée et est maintenant disponible sur la page de connexion.

## Configuration requise pour que les emails fonctionnent

Pour que les emails de réinitialisation de mot de passe soient réellement envoyés, vous devez configurer Supabase :

### 1. Accéder aux paramètres d'authentification
- Allez sur votre tableau de bord Supabase : https://supabase.com/dashboard
- Sélectionnez votre projet
- Allez dans **Authentication** > **Email Templates**

### 2. Configurer l'URL de redirection (TRÈS IMPORTANT)
- Allez dans **Authentication** > **URL Configuration**
- Ajoutez votre URL de site dans **Site URL** 
  - En développement: `http://localhost:5173` (ou votre port)
  - En production: `https://votre-app.com`
- Ajoutez les mêmes URLs dans **Redirect URLs** pour permettre la redirection après réinitialisation
- **CRUCIAL:** Sans cette configuration, le lien dans l'email ne fonctionnera pas correctement

### 3. Personnaliser le template d'email (optionnel)
- Dans **Email Templates** > **Reset Password**
- Vous pouvez personnaliser le contenu de l'email
- Par défaut, Supabase envoie un lien magique qui permet de se reconnecter

### 4. Configurer un fournisseur d'email (Production)

Par défaut, Supabase utilise son propre service d'email qui a des limitations. Pour la production :

- Allez dans **Settings** > **Auth** > **SMTP Settings**
- Configurez votre propre serveur SMTP (recommandé: SendGrid, AWS SES, Resend, etc.)

**Exemple avec SendGrid:**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Votre clé API SendGrid]
```

## Comment ça fonctionne

1. L'utilisateur clique sur "Mot de passe oublié ?" sur la page de connexion
2. Il entre son adresse email
3. Supabase envoie un email avec un lien de réinitialisation
4. L'utilisateur clique sur le lien dans l'email
5. Il est automatiquement redirigé vers la page de réinitialisation de mot de passe
6. Il entre son nouveau mot de passe (avec confirmation)
7. Le mot de passe est mis à jour dans Supabase
8. Il est redirigé vers la page de connexion pour se connecter avec son nouveau mot de passe

**Important:** L'application détecte automatiquement le token dans l'URL et affiche la page appropriée.

## Notes de sécurité

- Pour des raisons de sécurité, l'application affiche toujours "Email envoyé" même si l'email n'existe pas dans la base de données
- Cela empêche les attaquants de découvrir quels emails sont enregistrés
- Les liens de réinitialisation expirent après un certain temps (configurable dans Supabase)

## Test en développement

### Étapes de test :

1. **Créer un compte de test**
   - Créez un nouveau compte via la page d'inscription
   - Notez l'email et le mot de passe

2. **Tester la réinitialisation**
   - Allez sur la page de connexion
   - Cliquez sur "Mot de passe oublié ?"
   - Entrez votre email de test
   - Cliquez sur "Envoyer le lien"

3. **Vérifier l'email**
   - Ouvrez votre boîte mail
   - Cherchez l'email de Supabase (vérifiez les spams)
   - Cliquez sur le lien dans l'email

4. **Définir le nouveau mot de passe**
   - Vous serez redirigé vers la page de réinitialisation
   - Entrez votre nouveau mot de passe deux fois
   - Cliquez sur "Mettre à jour le mot de passe"

5. **Vérifier la connexion**
   - Vous serez redirigé vers la page de connexion
   - Connectez-vous avec votre nouveau mot de passe

### Dépannage :

- Si vous ne recevez pas d'email, vérifiez :
  - Les logs dans Supabase Dashboard > Authentication > Logs
  - Que le mode "Confirm email" est configuré correctement
  - Votre dossier spam
  - Que l'URL de redirection est correctement configurée

- Si le lien ne fonctionne pas :
  - Vérifiez que l'URL de redirection dans Supabase correspond à votre URL locale
  - Vérifiez la console du navigateur pour des erreurs
  - Assurez-vous que le token n'a pas expiré (ils expirent généralement après 1 heure)

## Prochaines étapes possibles

Pour améliorer encore cette fonctionnalité, vous pourriez :
1. Créer une page dédiée pour définir le nouveau mot de passe après avoir cliqué sur le lien
2. Ajouter une validation de force du mot de passe
3. Implémenter un système de questions de sécurité
4. Ajouter une authentification à deux facteurs (2FA)