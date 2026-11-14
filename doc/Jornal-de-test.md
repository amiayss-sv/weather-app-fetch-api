# Journal de tests — Weather App

## US-04 : Gestion des erreurs

**Objectif :** Vérifier que l'application affiche des messages clairs en cas d'erreur et permet de relancer la recherche.

### 1. Tests fonctionnels et tests d'erreurs

==================================================================================================================================
| N° | Test effectué                  | Résultat attendu                         | Résultat obtenu                   | Statut    |
==================================================================================================================================
| 01 | Recherche d'une ville valide   | Afficher les informations météo          | Météo affichée correctement       | ✅ Réussi |
| 02 | Recherche d'une ville inconnue | Afficher « Ville introuvable »           | Message d'erreur affiché          | ✅ Réussi |
| 03 | Simulation du code HTTP 429    | Afficher « Limite de requêtes atteinte » | Message affiché                   | ✅ Réussi |
| 04 | Simulation du code HTTP 500    | Afficher un message d'indisponibilité    | Message affiché                   | ✅ Réussi |
| 05 | Simulation du code HTTP 503    | Afficher un message d'indisponibilité    | Message affiché                   | ✅ Réussi |
| 06 | Coupure de connexion Internet  | Afficher un message de connexion         | Message affiché                   | ✅ Réussi |
| 07 | Cliquer sur « Réessayer »      | Relancer la dernière recherche           | Recherche relancée                | ✅ Réussi |

### 2. Vérification des fonctionnalités

- [x] Vérification de `response.ok` après chaque appel API.
- [x] Gestion des erreurs avec `try / catch`.
- [x] Gestion des codes HTTP 429, 500 et 503.
- [x] Vérification des villes inconnues.
- [x] Affichage des messages d'erreur.
- [x] Ajout du bouton « Réessayer ».
- [x] Relance de la dernière recherche.

### 3. Conclusion

Les tests effectués permettent de vérifier la gestion des erreurs de l'application Weather App. Les messages d'erreur sont affichés clairement et l'utilisateur peut relancer sa recherche grâce au bouton « Réessayer ».