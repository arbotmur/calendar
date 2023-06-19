<?php

declare(strict_types=1);
/**
 * Class Event
 */
class Event
{
    /**
     * @var string The file path for events
     */
    private $eventsFilePath = "uploads/data/";

    /**
     * Find an event by ID
     *
     * @param array $event The event data
     * @return array|null The event if found, null otherwise
     */
    public function findEventById(array $event): ?array
    {
        $eventDate = date('Y-m', strtotime($event['date']));
        $currentMonthFile = $file = "uploads/data/$eventDate.json";

        // Chercher dans le fichier du mois de l'événement
        if (is_file($file)) {
            $events = $this->getEventsFromFile($file);
            if (isset($events[$event['id']])) {
                $events[$event['id']]['path'] = $file;
                return $events[$event['id']];
            }
        }

        // Chercher dans tous les fichiers JSON
        $files = glob("uploads/data/*.json");
        foreach ($files as $file) {
            if ($file !== $currentMonthFile) {
                $events = $this->getEventsFromFile($file);
                if (isset($events[$event['id']])) {
                    $events[$event['id']]['path'] = $file;
                    return $events[$event['id']];
                }
            }
        }

        return null;
    }

    /**
     * Create a new event
     *
     * @param array $event The event data
     * @param int $id The optional ID for the event
     * @return array The created event
     */
    public function create(array $event, int $id = 0): array
    {
        $filePath = $this->eventsFilePath . date('Y-m', strtotime($event['date'])) . '.json';
        $events = $this->getEventsFromFile($filePath);

        $event['id'] = $id == 0 ? $this->generateUniqueId() : $id;
        $events[$event['id']]['path'] = $filePath;
        $events[$event['id']] = $event;

        $this->saveEventsToFile($filePath, $events);

        return $event;
    }

    /**
     * Update an existing event
     *
     * @param array $event The updated event data
     * @return array The updated event
     */
    public function update(array $event): array
    {
        $oldEvent = $this->findEventById($event);
        if ($oldEvent['date'] != $event['date']) {
            $this->delete($oldEvent);
        }
        $this->create($event, (int)$event['id']);
        return $event;
    }

    /**
     * Delete an event
     *
     * @param array $event The event data
     * @return void
     */
    public function delete(array $event): void
    {
        if (!isset($event['path'])) {
            $event = $this->findEventById($event);
        }
        $path = $event['path'];
        $events = $this->getEventsFromFile($event['path']);

        if (isset($events[$event['id']])) {

            if (isset($events[$event['id']]['fileUrl'])) {
                foreach ($events[$event['id']]['fileUrl'] as $fileUrl) {
                    if (is_file($fileUrl)) {
                        unlink($fileUrl);
                    }
                    $thumbFile = str_replace('uploads/image/', 'uploads/thumb/', $fileUrl);
                    if (is_file($thumbFile)) {
                        unlink($thumbFile);
                    }
                }
            }

            unset($events[$event['id']]);
            $this->saveEventsToFile($path, $events);
        }
    }

    /**
     * Get events from a JSON file
     *
     * @param string $file The file path
     * @return array The events from the file
     */
    private function getEventsFromFile(string $file): array
    {
        if (file_exists($file)) {
            return json_decode(file_get_contents($file), true);
        }

        return [];
    }

    /**
     * Save events to a JSON file
     *
     * @param string $file The file path
     * @param array $events The events to save
     * @return void
     */
    private function saveEventsToFile(string $file, array $events): void
    {
        // Vérifier si le répertoire de destination existe, sinon le créer
        $dir = dirname($file);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        file_put_contents($file, json_encode($events, JSON_PRETTY_PRINT));
    }

    /**
     * Generate a unique ID for an event
     *
     * @return string The unique ID
     */
    private function generateUniqueId(): int
    {
        return (int)(1000 * microtime(true));
    }

    public function load($year, $month)
    {
        if (strlen(''.$month)== 1) {
            $month = '0'.$month;
        }
        $file = 'uploads/data/' . $year . '-' . $month . '.json';
        return is_file($file) ? file_get_contents($file) : json_encode([]);
    }
}
