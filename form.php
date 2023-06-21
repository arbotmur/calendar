<form action="/add.php" id="event-form" method="POST" enctype="multipart/form-data">
    <h2 id="event-form-title">Ajouter un événement</h2>
    <input type="hidden" name="id" value="0" id="event-id"/>
    <div class="form-row">
        <div class="form-column">
            <label for="event-date">Date:</label>
            <input type="date" id="event-date" name="date" required value="<?php echo date("Y-m-d");?>" />
        </div>
        <div class="form-column">
            <label for="event-time">Heure:</label>
            <input type="time" id="event-time" name="time" required value="" pattern="[0-9]{2}:[0-9]{2}"/>
        </div>
        <div class="form-column">
            <label for="event-color">Couleur:</label>
            <input type="color" id="event-color" name="color" value="#f9d309"/>
        </div>
    </div>
    <label for="event-user">Votre nom:</label>
    <input type="text" id="event-user" name="user" placeholder="Votre nom" required />
    <br />
    <label for="event-title">Titre:</label>
    <input type="text" id="event-title" name="name" placeholder="titre" required />
    <br />
    <label for="event-text">Votre texte:</label>
    <textarea id="event-text" placeholder="Votre texte" name="description" required rows="10"></textarea>
    <br />
    <label for="event-images">Ajoutez des photos:</label>
    <div class="file-input">
        <input type="file" id="event-images" name="images" multiple />
        <span class="file-label">Choisir des fichiers</span>
    </div>
    <br/>
  <div id="image-preview"></div>
  <br/>
    <button type="submit" >Publier</button>
</form>