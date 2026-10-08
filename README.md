# Démarches en clair — Sénégal

Prototype indépendant, préparé pour HACK47 OFFGRID. Il explique une seule démarche à partir de la fiche officielle du ministère : demander ou remplacer une carte nationale d’identité biométrique. Il ne dépose aucune demande et ne délivre aucun document.

## Démarrer

Depuis ce dossier, lancer un serveur statique :

```powershell
python -m http.server 4178
```

Ouvrir ensuite <http://127.0.0.1:4178>. La première visite doit être faite avec une connexion pour mettre en cache l’application. Une fois le service worker activé, la fiche est consultable hors ligne. Le mémo est conservé localement dans le navigateur et n’est envoyé à aucun serveur.

## Source et limites

- Source utilisée : [Ministère de l’Intérieur — Carte nationale d’identité biométrique](https://www.interieur.gouv.sn/services/services-aux-usagers/carte-nationale-d-identite-biometrique), consultée le 8 octobre 2026.
- Le prototype n’affiche pas d’horaires, de rendez-vous ni de délais, car ils ne sont pas précisés dans cette fiche.
- La traduction des consignes en wolof n’est pas publiée : elle devra être relue par un locuteur compétent avant usage.
- Ce site n’est pas affilié à l’administration sénégalaise. Il faut vérifier les informations auprès de la DAF (numéro vert indiqué par le ministère : 800 00 2012).

## Transparence

Le prototype et son code ont été réalisés avec l’aide d’un assistant de programmation IA. Avant une soumission Devpost, mettre à jour la description, les technologies réellement utilisées, le dépôt source et la vidéo de démonstration; ne pas présenter de fonctionnalités non construites.
